import psycopg2
import bcrypt
from database import DB_CONFIG

def add_voter(full_name, university_id, access_token):
    # Hash the token directly using bcrypt
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(access_token.encode('utf-8'), salt).decode('utf-8')
    
    conn = None
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        cur.execute(
            "INSERT INTO users (full_name, email, password) VALUES (%s, %s, %s) RETURNING id",
            (full_name, university_id, hashed_password)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        print(f"✅ Success! Voter added with ID: {user_id}")
        print(f"University ID: {university_id}")
        print(f"Access Token: {access_token}")
        
    except Exception as e:
        print(f"❌ Error adding voter: {e}")
    finally:
        if conn:
            cur.close()
            conn.close()

if __name__ == "__main__":
    print("--- Add New Voter to UniVote ---")
    name = input("Enter Full Name: ")
    uid = input("Enter University ID: ")
    token = input("Enter Access Token (min 6 chars): ")
    
    if len(token) < 6:
        print("❌ Error: Token must be at least 6 characters.")
    else:
        add_voter(name, uid, token)
