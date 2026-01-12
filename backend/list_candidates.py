import psycopg2
from database import DB_CONFIG

def list_candidates():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        cur.execute("SELECT id, name, position, image_url, votes_count FROM candidates")
        candidates = cur.fetchall()
        
        if not candidates:
            print("📭 No candidates found in the database.")
        else:
            print(f"--- Currently {len(candidates)} Candidates ---")
            for c in candidates:
                print(f"ID: {c[0]} | Name: {c[1]} | Position: {c[2]} | Image: {c[3]} | Votes: {c[4]}")
        
    except Exception as e:
        print(f"❌ Error listing candidates: {e}")
    finally:
        if 'conn' in locals() and conn:
            cur.close()
            conn.close()

if __name__ == "__main__":
    list_candidates()
