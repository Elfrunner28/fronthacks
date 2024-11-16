from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

def init_db():
    with sqlite3.connect('app.db') as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS locations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                latitudeStart REAL,
                longitudeStart REAL,
                latitudeEnd REAL,
                longitudeEnd REAL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        ''')
        conn.commit()
    print("Database initialized.")

init_db()

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    with sqlite3.connect('app.db') as conn:
        cursor = conn.cursor()
        try:
            cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
            conn.commit()
            return jsonify({'status': 'success', 'message': 'Registration successful!'})
        except sqlite3.IntegrityError:
            return jsonify({'status': 'error', 'message': 'Username already exists.'}), 409

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    with sqlite3.connect('app.db') as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
        user = cursor.fetchone()
        if user:
            return jsonify({'status': 'success', 'user_id': user[0]})
        else:
            return jsonify({'status': 'error', 'message': 'Invalid credentials'}), 401

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    user_id = data.get('user_id')  # Get user ID from the request
    latitude1 = data.get('latitude1')
    longitude1 = data.get('longitude1')
    latitude2 = data.get('latitude2')
    longitude2 = data.get('longitude2')

    # Check if this user already submitted their locations
    with sqlite3.connect('app.db') as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM locations WHERE user_id = ?", (user_id,))
        if cursor.fetchone():  # If any entry exists, user already submitted
            return jsonify({'status': 'error', 'message': 'You have already submitted your start and end locations for this session.'}), 403

        # Insert new data for this user
        cursor.execute('''
            INSERT INTO locations (user_id, latitudeStart, longitudeStart, latitudeEnd, longitudeEnd)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, latitude1, longitude1, latitude2, longitude2))
        conn.commit()

    return jsonify({'status': 'success', 'message': 'Coordinates saved successfully.'})

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5000, debug=True)