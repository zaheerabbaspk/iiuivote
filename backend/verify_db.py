
import psycopg2
from database import DB_CONFIG

try:
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute("SELECT id, name, image_url FROM candidates WHERE id = 6")
    row = cur.fetchone()
    if row:
        print(f"Candidate {row[0]}: {row[1]}")
        if row[2]:
            print(f"Image URL starts with: {row[2][:50]}...")
        else:
            print("Image URL is EMPTY")
    else:
        print("Candidate 6 NOT FOUND")
    conn.close()
except Exception as e:
    print(f"Error: {e}")
