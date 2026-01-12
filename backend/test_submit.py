
import requests
import json
import time
import psycopg2
from database import DB_CONFIG

BASE_URL = "http://localhost:8000"

def wait_for_api():
    print("Waiting for API to be ready...")
    for _ in range(10):
        try:
            requests.get(f"{BASE_URL}/docs")
            print("API is ready.")
            return True
        except:
            time.sleep(1)
    print("API failed to start.")
    return False

def test_submission():
    if not wait_for_api():
        return

    # Small red dot base64
    base64_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
    
    payload = {
        "name": "API Test Candidate",
        "position": "Tester",
        "party": "Debug Party",
        "electionId": "1",
        "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
    }
    
    print("Submitting candidate via API...")
    try:
        response = requests.post(f"{BASE_URL}/candidates", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")
        return

    print("Verifying in Database...")
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        cur.execute("SELECT image_url FROM candidates WHERE name = 'API Test Candidate'")
        row = cur.fetchone()
        conn.close()
        
        if row and row[0] and row[0].startswith("data:image"):
            print("SUCCESS: Image URL found in database!")
            print(f"Stored URL prefix: {row[0][:30]}...")
        else:
            print("FAILURE: Image URL NOT found or incorrect in database.")
            print(f"Row: {row}")
    except Exception as e:
        print(f"Database check failed: {e}")

if __name__ == "__main__":
    test_submission()
