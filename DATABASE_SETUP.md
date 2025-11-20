# Database Setup Guide

## Quick Setup

This guide shows you how to save emails with unique session IDs to a database.

## How It Works

1. **Unique Session ID**: Each user visit gets a unique session ID when they start the quiz
2. **Session Storage**: The ID is stored in the browser's `sessionStorage` (clears when browser tab closes)
3. **Email Submission**: When the user submits their email, both the email and session ID are sent to your backend
4. **Database Save**: Your backend saves both the email and session ID to a database

## Option 1: Next.js API Route (Already Set Up)

The Next.js API route is already created at `app/api/save-email/route.ts`.

**To use it:**
1. Uncomment and implement the database save logic in `app/api/save-email/route.ts`
2. The API will be available at: `http://localhost:3000/api/save-email` (in development)

## Option 2: Python Flask Backend (Recommended for Vultr)

Since you know Python and use Vultr, here's a Python Flask backend you can deploy:

### Setup Steps:

1. **On your Vultr server, create a directory:**
   ```bash
   mkdir ~/quiz-backend
   cd ~/quiz-backend
   ```

2. **Copy the Python files:**
   - `backend_example.py`
   - `backend_requirements.txt`

3. **Install dependencies:**
   ```bash
   pip install -r backend_requirements.txt
   ```

4. **Run the server:**
   ```bash
   python backend_example.py
   ```

5. **Update your Next.js app:**
   - Create a `.env.local` file in your project root
   - Add: `NEXT_PUBLIC_API_ENDPOINT=http://your-vultr-server-ip:5000/api/save-email`
   - Or update `EmailPage.tsx` directly with your API URL

### Using PostgreSQL (More Robust):

Replace SQLite with PostgreSQL in `backend_example.py`:

```python
import psycopg2
from psycopg2.extras import RealDictCursor

def init_db():
    conn = psycopg2.connect(
        host='localhost',
        database='quiz_db',
        user='your_user',
        password='your_password'
    )
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS email_submissions (
            id SERIAL PRIMARY KEY,
            session_id VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            quiz_answers JSONB,
            privacy_consent BOOLEAN,
            marketing_consent BOOLEAN,
            created_at TIMESTAMP,
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()
```

## Data Structure

When an email is submitted, your backend receives:

```json
{
  "sessionId": "session_1234567890_abc123",
  "email": "user@example.com",
  "quizAnswers": {
    "0": "25-34",
    "1": "Gain financial skills",
    "2": "Always",
    ...
  },
  "privacyConsent": true,
  "marketingConsent": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "submittedAt": "2024-01-15T10:35:00.000Z"
}
```

## Session ID Details

- **Format**: `session_timestamp_random` (e.g., `session_1234567890_abc123`)
- **Uniqueness**: Generated when the quiz starts, unique per browser tab/window
- **Storage**: Stored in `sessionStorage` (clears when browser tab closes)
- **Purpose**: Links the quiz answers to the email submission

## Database Schema Example

```sql
CREATE TABLE email_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- or SERIAL for PostgreSQL
    session_id VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    quiz_answers TEXT,  -- JSON string or JSONB for PostgreSQL
    privacy_consent BOOLEAN,
    marketing_consent BOOLEAN,
    created_at TEXT,  -- ISO timestamp
    submitted_at TEXT,  -- ISO timestamp
    created_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX idx_session_id ON email_submissions(session_id);
CREATE INDEX idx_email ON email_submissions(email);
```

## Deployment on Vultr

### Using Gunicorn (Production):

1. **Install Gunicorn:**
   ```bash
   pip install gunicorn
   ```

2. **Run with Gunicorn:**
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 backend_example:app
   ```

3. **Use Nginx as reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location /api {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## Testing

You can test the API with:

```bash
curl -X POST http://localhost:5000/api/save-email \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_test_123",
    "email": "test@example.com",
    "privacyConsent": true,
    "marketingConsent": false,
    "quizAnswers": {"0": "25-34"},
    "createdAt": "2024-01-15T10:30:00.000Z",
    "submittedAt": "2024-01-15T10:35:00.000Z"
  }'
```

## Environment Variables

Create `.env.local` in your Next.js project root:

```env
NEXT_PUBLIC_API_ENDPOINT=http://your-vultr-server-ip:5000/api/save-email
```

Or for production:
```env
NEXT_PUBLIC_API_ENDPOINT=https://api.yourdomain.com/api/save-email
```

