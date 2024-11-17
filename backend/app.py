from flask import Flask, request, jsonify
from flask_cors import CORS
from pyairtable import Table
from pyairtable.formulas import match

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://fronthacks-ciug4gako-karti-bombs-projects.vercel.app"]}})

AIRTABLE_API_KEY = 'patsFqbRqun6dUd2J.ac98f1950d92ace45ecb36edc8fb73956d10cf63975540135821f13df6814b9b'
BASE_ID = "appdXx9TjXKr6XqeL"
TABLE_NAME_USERS = "users"
TABLE_NAME_LOCATIONS = "locations"

users_table = Table(AIRTABLE_API_KEY, BASE_ID, TABLE_NAME_USERS)
locations_table = Table(AIRTABLE_API_KEY, BASE_ID, TABLE_NAME_LOCATIONS)


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Check if username already exists
    existing_users = users_table.all(formula=match({"username": username}))
    if existing_users:
        return jsonify({'status': 'error', 'message': 'Username already exists.'}), 409

    # Add new user
    new_user = {'username': username, 'password': password}
    users_table.create(new_user)
    return jsonify({'status': 'success', 'message': 'Registration successful!'})


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Check credentials
    existing_users = users_table.all(formula=match({"username": username, "password": password}))
    if existing_users:
        user_id = existing_users[0]['id']
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
    existing_locations = locations_table.all(formula=match({"user_id": user_id}))
    if existing_locations:
        return jsonify({'status': 'error', 'message': 'You have already submitted your start and end locations for this session.'}), 403

    # Add new location record
    new_location = {
        'user_id': user_id,
        'latitudeStart': latitude1,
        'longitudeStart': longitude1,
        'latitudeEnd': latitude2,
        'longitudeEnd': longitude2,
    }
    locations_table.create(new_location)
    return jsonify({'status': 'success', 'message': 'Coordinates saved successfully.'})


if __name__ == '__main__':
    port = 10000
    app.run(host="0.0.0.0", port=port, debug=True)