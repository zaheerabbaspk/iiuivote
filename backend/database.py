import psycopg2
from psycopg2 import pool
import os
from contextlib import contextmanager

# Database configuration
# Note: In a real app, use environment variables
DB_CONFIG = {
    "dbname": "voting_db",
    "user": "postgres",
    "password": "blove1234@",
    "host": "localhost",
    "port": "5432"
}

# Create a connection pool with explicit error handling
connection_pool = None

def initialize_pool():
    global connection_pool
    try:
        connection_pool = psycopg2.pool.SimpleConnectionPool(1, 20, **DB_CONFIG)
        print("✅ Database connection pool created successfully")
    except psycopg2.OperationalError as e:
        print(f"❌ DATABASE CONNECTION ERROR: {e}")
        print("\nPossible fixes:")
        print("1. Check if PostgreSQL IS RUNNING.")
        print("2. Check if your PASSWORD is correct in 'database.py'.")
        print("3. Check if 'voting_db' exists. Run: 'createdb -U postgres voting_db'")
        connection_pool = None
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
        connection_pool = None

# Try to initialize on module load
initialize_pool()

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
    """Initialize database tables, creating database if it doesn't exist"""
    # First, try to create the database by connecting to default 'postgres' db
    temp_config = DB_CONFIG.copy()
    temp_config["dbname"] = "postgres"
    try:
        conn = psycopg2.connect(**temp_config)
        conn.autocommit = True
        with conn.cursor() as cur:
            cur.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{DB_CONFIG['dbname']}'")
            exists = cur.fetchone()
            if not exists:
                print(f"Creating database {DB_CONFIG['dbname']}...")
                cur.execute(f"CREATE DATABASE {DB_CONFIG['dbname']}")
        conn.close()
    except Exception as e:
        print(f"Note: Database creation check skipped or failed: {e}")

    # Now proceed with table creation using the pool
    if connection_pool is None:
        initialize_pool()

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
                    party TEXT,
                    election_id TEXT,
                    image_url TEXT,
                    votes_count INTEGER DEFAULT 0
                );
            """)
            
            # Add columns if they don't exist (for existing databases)
            cur.execute("""
                DO $$ 
                BEGIN 
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                   WHERE table_name='candidates' AND column_name='party') THEN
                        ALTER TABLE candidates ADD COLUMN party TEXT;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                   WHERE table_name='candidates' AND column_name='election_id') THEN
                        ALTER TABLE candidates ADD COLUMN election_id TEXT;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                   WHERE table_name='candidates' AND column_name='image_url') THEN
                        ALTER TABLE candidates ADD COLUMN image_url TEXT;
                    END IF;
                END $$;
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
                    INSERT INTO candidates (name, position, party, election_id, image_url) VALUES
                    ('Dr. Alice Smith', 'President', 'Party A', 'ELEC-2024', 'https://i.pravatar.cc/150?u=1'),
                    ('Prof. Bob Jones', 'President', 'Party B', 'ELEC-2024', 'https://i.pravatar.cc/150?u=2'),
                    ('Charlie Brown', 'General Secretary', 'Independent', 'ELEC-2024', 'https://i.pravatar.cc/150?u=3'),
                    ('Diana Prince', 'General Secretary', 'Party C', 'ELEC-2024', 'https://i.pravatar.cc/150?u=4');
                """)
            
            print("Database initialized successfully")

if __name__ == "__main__":
    init_db()
