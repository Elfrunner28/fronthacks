from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
# import sqlitecloud
import airtable

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://frontend-i5m3jh390-karti-bombs-projects.vercel.app"]}})

DB_CONN_STR = "sqlitecloud://cjovbg3mnz.sqlite.cloud:8860?apikey=DynrgkzGbHbVidIsqqVazz44VbEm4ZAa0iaaY2olU80"

def init_db():
    with sqlitecloud.connect(DB_CONN_STR) as conn:
        db_name = "fronthacks.sqlite"
        conn.execute(f"USE DATABASE {db_name}")
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



@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    with sqlitecloud.connect(DB_CONN_STR) as conn:
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

    with sqlitecloud.connect(DB_CONN_STR) as conn:
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
    user_id = data.get('user_id') 
    latitude1 = data.get('latitude1')
    longitude1 = data.get('longitude1')
    latitude2 = data.get('latitude2')
    longitude2 = data.get('longitude2')

    
    with sqlitecloud.connect(DB_CONN_STR) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM locations WHERE user_id = ?", (user_id,))
        if cursor.fetchone(): 
            return jsonify({'status': 'error', 'message': 'You have already submitted your start and end locations for this session.'}), 403

        
        cursor.execute('''
            INSERT INTO locations (user_id, latitudeStart, longitudeStart, latitudeEnd, longitudeEnd)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, latitude1, longitude1, latitude2, longitude2))
        conn.commit()

    return jsonify({'status': 'success', 'message': 'Coordinates saved successfully.'})

if __name__ == '__main__':
    port = 10000
    # conn = sqlitecloud.connect(DB_CONN_STR)

# You can autoselect the database during the connect call
# by adding the database name as path of the SQLite Cloud
# connection string, eg:
    AIRTABLE_API_KEY = 'patsFqbRqun6dUd2J.ac98f1950d92ace45ecb36edc8fb73956d10cf63975540135821f13df6814b9b'
    BASE_ID ="appdXx9TjXKr6XqeL"
    at = airtable.Airtable(BASE_ID, AIRTABLE_API_KEY)
    table = at.get('Route Requests')
    print(table)

    app.run(host="0.0.0.0", port=port, debug=True)