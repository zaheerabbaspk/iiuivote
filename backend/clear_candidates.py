import psycopg2
from database import DB_CONFIG

def clear_candidates():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # We need to clear votes first because of foreign key constraint
        print("Clearing all votes...")
        cur.execute("DELETE FROM votes")
        
        print("Clearing all candidates...")
        cur.execute("DELETE FROM candidates")
        
        conn.commit()
        print("✅ Database cleaned! All old candidates and votes removed.")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        if 'conn' in locals() and conn:
            cur.close()
            conn.close()

if __name__ == "__main__":
    confirm = input("Are you sure you want to delete ALL candidates and votes? (y/n): ")
    if confirm.lower() == 'y':
        clear_candidates()
    else:
        print("Operation cancelled.")
