# University Voting App - Backend

This is a Python FastAPI backend for a university voting system using PostgreSQL.

## Prerequisites
- Python 3.8+
- PostgreSQL database

## Setup

1. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Database:**
   Update the `DB_CONFIG` in `database.py` with your PostgreSQL credentials:
   ```python
   DB_CONFIG = {
       "dbname": "voting_db",
       "user": "postgres",
       "password": "your_password",
       "host": "localhost",
       "port": "5432"
   }
   ```

3. **Initialize Database:**
   Run the database initialization script to create tables and insert sample candidates:
   ```bash
   python database.py
   ```

4. **Run the API:**
   ```bash
   python main.py
   ```
   The API will be available at `http://localhost:8000`.

## API Endpoints

- `POST /register`: Register a new user.
- `POST /login`: Authenticate a user.
- `GET /candidates`: List all available candidates.
- `POST /vote`: Submit a vote for a candidate (one vote per user).
- `GET /results`: View real-time voting results.

## Documentation
Once the server is running, visit `http://localhost:8000/docs` for the interactive Swagger UI.
