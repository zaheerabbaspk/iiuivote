
import psycopg2
from database import get_db_connection

def update_candidate_image():
    # Small red dot base64 image
    base64_image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
    
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Update Zaheer's image
            cur.execute(
                "UPDATE candidates SET image_url = %s WHERE name ILIKE '%zaheer%' RETURNING id, name, image_url;",
                (base64_image,)
            )
            updated = cur.fetchone()
            
            if updated:
                print(f"Updated Candidate: {updated[1]}")
                print(f"New Image URL (first 50 chars): {updated[2][:50]}...")
            else:
                print("Candidate 'Zaheer' not found!")
                
if __name__ == "__main__":
    update_candidate_image()
