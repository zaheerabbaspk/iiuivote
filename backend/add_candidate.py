import psycopg2
from database import DB_CONFIG

def add_candidate(name, position, image_url):
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        cur.execute(
            "INSERT INTO candidates (name, position, image_url) VALUES (%s, %s, %s) RETURNING id",
            (name, position, image_url)
        )
        candidate_id = cur.fetchone()[0]
        conn.commit()
        print(f"✅ Success! Candidate added with ID: {candidate_id}")
        
    except Exception as e:
        print(f"❌ Error adding candidate: {e}")
    finally:
        if 'conn' in locals() and conn:
            cur.close()
            conn.close()

if __name__ == "__main__":
    print("--- Add New Candidate to UniVote ---")
    name = input("Enter Candidate Name: ")
    pos = input("Enter Position (e.g., President): ")
    img = input("Enter Image URL (optional, press Enter to skip): ")
    
    if name and pos:
        add_candidate(name, pos, img if img else None)
    else:
        print("❌ Error: Both name and position are required.")
