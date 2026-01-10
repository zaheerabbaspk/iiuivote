import psycopg2
from psycopg2 import pool
import os
from contextlib import contextmanager

# Database configuration
# Note: In a real app, use environment variables
DB_CONFIG = {
    "dbname": "voting_db",
    "user": "postgres",
    "password": "your_password",
    "host": "localhost",
    "port": "5432"
}

# Create a connection pool
try:
    connection_pool = psycopg2.pool.SimpleConnectionPool(1, 20, **DB_CONFIG)
    print("Database connection pool created successfully")
except Exception as e:
    print(f"Error creating connection pool: {e}")
    connection_pool = None

@contextmanager
def get_db_connection():
    if connection_pool is None:
        raise Exception("Database connection pool not initialized")
    conn = connection_pool.getconn()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        connection_pool.putconn(conn)

def init_db():
    """Initialize database tables"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Users table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    full_name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            
            # Candidates table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS candidates (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    position TEXT NOT NULL,
                    votes_count INTEGER DEFAULT 0
                );
            """)
            
            # Votes table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS votes (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id),
                    candidate_id INTEGER REFERENCES candidates(id),
                    vote_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(user_id)
                );
            """)
            
            # Insert sample candidates if none exist
            cur.execute("SELECT COUNT(*) FROM candidates;")
            if cur.fetchone()[0] == 0:
                cur.execute("""
                    INSERT INTO candidates (name, position) VALUES
                    ('Dr. Alice Smith', 'President'),
                    ('Prof. Bob Jones', 'President'),
                    ('Charlie Brown', 'General Secretary'),
                    ('Diana Prince', 'General Secretary');
                """)
            
            print("Database initialized successfully")

if __name__ == "__main__":
    init_db()
