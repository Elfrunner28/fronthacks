from flask import Flask, request, jsonify
from flask_cors import CORS
import airtable

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://fronthacks-np7zunt0t-karti-bombs-projects.vercel.app"]}})

AIRTABLE_API_KEY = 'patsFqbRqun6dUd2J.ac98f1950d92ace45ecb36edc8fb73956d10cf63975540135821f13df6814b9b'
BASE_ID = "appdXx9TjXKr6XqeL"
at = airtable.Airtable(BASE_ID, AIRTABLE_API_KEY)
TABLE_NAME_USERS = "users"
TABLE_NAME_LOCATIONS = "locations"


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Check if username already exists
    existing_users = at.get(TABLE_NAME_USERS, formula=f"username='{username}'")
    if existing_users.get('records'):
        return jsonify({'status': 'error', 'message': 'Username already exists.'}), 409

    # Add new user
    new_user = {'username': username, 'password': password}
    at.insert(TABLE_NAME_USERS, new_user)
    return jsonify({'status': 'success', 'message': 'Registration successful!'})


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Check credentials
    existing_users = at.get(TABLE_NAME_USERS, formula=f"username='{username}' AND password='{password}'")
    if existing_users.get('records'):
        user_id = existing_users['records'][0]['id']
        return jsonify({'status': 'success', 'user_id': user_id})
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

    # Check if user has already submitted locations
    existing_locations = at.get(TABLE_NAME_LOCATIONS, formula=f"user_id='{user_id}'")
    if existing_locations.get('records'):
        return jsonify({'status': 'error', 'message': 'You have already submitted your start and end locations for this session.'}), 403

    # Add new location record
    new_location = {
        'user_id': user_id,
        'latitudeStart': latitude1,
        'longitudeStart': longitude1,
        'latitudeEnd': latitude2,
        'longitudeEnd': longitude2,
    }
    at.insert(TABLE_NAME_LOCATIONS, new_location)
    return jsonify({'status': 'success', 'message': 'Coordinates saved successfully.'})


if __name__ == '__main__':
    port = 10000
    app.run(host="0.0.0.0", port=port, debug=True)