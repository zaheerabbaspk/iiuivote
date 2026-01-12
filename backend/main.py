from fastapi import FastAPI, HTTPException, Depends, status, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import psycopg2.extras
import bcrypt

from database import get_db_connection, init_db
from models import (
    UserCreate, UserResponse, LoginRequest, 
    CandidateResponse, VoteRequest, ResultResponse,
    CandidateCreate
)

app = FastAPI(title="University Voting App API")

# Password hashing setup (switching to direct bcrypt for compatibility)
def get_password_hash(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

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
def login(data: dict = Body(...)):
    email = data.get("email")
    password = data.get("password")
    
    print(f"--- Login Request Received ---")
    print(f"Data: {data}")
    
    if not email or not password:
        print("❌ Error: Missing email or password in request")
        raise HTTPException(status_code=422, detail="Missing university ID or token")

    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cur.fetchone()
            
            if not user:
                print(f"❌ Error: User not found -> {email}")
                raise HTTPException(status_code=401, detail="Invalid university ID or token")
            
            if not verify_password(password, user["password"]):
                print(f"❌ Error: Password mismatch for -> {email}")
                raise HTTPException(status_code=401, detail="Invalid university ID or token")
            
            print(f"✅ Success: User logged in -> {email}")
            return {"id": user["id"], "full_name": user["full_name"], "email": user["email"]}

@app.get("/candidates", response_model=List[CandidateResponse])
def get_candidates():
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT id, name, position, image_url, votes_count FROM candidates")
            return cur.fetchall()

@app.post("/candidates", status_code=status.HTTP_201_CREATED)
def add_candidate(candidate: CandidateCreate):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            try:
                cur.execute(
                    "INSERT INTO candidates (name, position, party, election_id, image_url) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                    (candidate.name, candidate.position, candidate.party, candidate.election_id, candidate.image_url)
                )
                new_id = cur.fetchone()[0]
                return {"id": new_id, "message": "Candidate added successfully"}
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

@app.post("/vote")
def submit_vote(vote: VoteRequest):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            try:
                cur.execute(
                    "INSERT INTO votes (user_id, candidate_id) VALUES (%s, %s)",
                    (vote.user_id, vote.candidate_id)
                )
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
            cur.execute("SELECT id as candidate_id, name, position, party, election_id, image_url, votes_count FROM candidates ORDER BY votes_count DESC")
            return cur.fetchall()

@app.get("/admin/vote-logs")
def get_vote_logs():
    """Admin only endpoint to see who voted for whom"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""
                SELECT v.id, u.full_name as voter_name, u.email as university_id, 
                       c.name as candidate_name, v.vote_time 
                FROM votes v
                JOIN users u ON v.user_id = u.id
                JOIN candidates c ON v.candidate_id = c.id
                ORDER BY v.vote_time DESC
            """)
            return cur.fetchall()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
