from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import psycopg2.extras
from passlib.context import CryptContext

from database import get_db_connection, init_db
from models import (
    UserCreate, UserResponse, LoginRequest, 
    CandidateResponse, VoteRequest, ResultResponse
)

app = FastAPI(title="University Voting App API")

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

@app.post("/register", response_model=UserResponse)
def register(user: UserCreate):
    hashed_password = get_password_hash(user.password)
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            try:
                cur.execute(
                    "INSERT INTO users (full_name, email, password) VALUES (%s, %s, %s) RETURNING id, full_name, email, created_at",
                    (user.full_name, user.email, hashed_password)
                )
                new_user = cur.fetchone()
                return new_user
            except psycopg2.IntegrityError:
                raise HTTPException(status_code=400, detail="Email already registered")

@app.post("/login")
def login(request: LoginRequest):
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM users WHERE email = %s", (request.email,))
            user = cur.fetchone()
            if not user or not verify_password(request.password, user["password"]):
                raise HTTPException(status_code=401, detail="Invalid email or password")
            
            # For simplicity, returning user info. In real app, return JWT.
            return {"id": user["id"], "full_name": user["full_name"], "email": user["email"]}

@app.get("/candidates", response_model=List[CandidateResponse])
def get_candidates():
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT id, name, position, votes_count FROM candidates")
            return cur.fetchall()

@app.post("/vote")
def submit_vote(vote: VoteRequest):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            try:
                # Insert vote (Unique constraint on user_id ensures voting only once)
                cur.execute(
                    "INSERT INTO votes (user_id, candidate_id) VALUES (%s, %s)",
                    (vote.user_id, vote.candidate_id)
                )
                # Increment candidate vote count
                cur.execute(
                    "UPDATE candidates SET votes_count = votes_count + 1 WHERE id = %s",
                    (vote.candidate_id,)
                )
                return {"message": "Vote submitted successfully"}
            except psycopg2.IntegrityError:
                raise HTTPException(status_code=400, detail="User has already voted")
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

@app.get("/results", response_model=List[ResultResponse])
def get_results():
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT id as candidate_id, name, position, votes_count FROM candidates ORDER BY votes_count DESC")
            return cur.fetchall()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
