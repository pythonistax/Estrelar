"""
Python Flask Backend Example for Saving Emails with Session IDs
You can deploy this on Vultr and connect your Next.js frontend to it

Install dependencies:
pip install flask flask-cors sqlalchemy psycopg2  # For PostgreSQL
# OR
pip install flask flask-cors sqlite3  # For SQLite (simpler, built-in)

Run:
python backend_example.py

The API will be available at http://localhost:5000/api/save-email
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)  # Allow requests from your Next.js frontend

# Database setup (SQLite example - replace with PostgreSQL/MySQL for production)
DB_NAME = 'quiz_submissions.db'

def init_db():
    """Initialize database table"""
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS email_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            email TEXT NOT NULL,
            quiz_answers TEXT,
            privacy_consent BOOLEAN,
            marketing_consent BOOLEAN,
            created_at TEXT,
            submitted_at TEXT,
            created_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/api/save-email', methods=['POST'])
def save_email():
    """Save email with session ID to database"""
    try:
        data = request.json
        
        # Extract data
        session_id = data.get('sessionId')
        email = data.get('email')
        quiz_answers = json.dumps(data.get('quizAnswers', {}))  # Store as JSON string
        privacy_consent = data.get('privacyConsent', False)
        marketing_consent = data.get('marketingConsent', False)
        created_at = data.get('createdAt')
        submitted_at = data.get('submittedAt', datetime.now().isoformat())
        
        # Validate required fields
        if not email or not session_id:
            return jsonify({'error': 'Email and session ID are required'}), 400
        
        # Save to database
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        c.execute('''
            INSERT INTO email_submissions 
            (session_id, email, quiz_answers, privacy_consent, marketing_consent, created_at, submitted_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (session_id, email, quiz_answers, privacy_consent, marketing_consent, created_at, submitted_at))
        conn.commit()
        conn.close()
        
        print(f"✅ Saved: Session {session_id}, Email: {email}")
        
        return jsonify({
            'success': True,
            'message': 'Email saved successfully',
            'sessionId': session_id,
            'timestamp': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        print(f"❌ Error saving email: {e}")
        return jsonify({
            'error': 'Failed to save email',
            'details': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'timestamp': datetime.now().isoformat()}), 200

if __name__ == '__main__':
    # Initialize database
    init_db()
    print("📊 Database initialized")
    print("🚀 Starting Flask server on http://localhost:5000")
    print("📧 Email submission endpoint: http://localhost:5000/api/save-email")
    app.run(host='0.0.0.0', port=5000, debug=True)

