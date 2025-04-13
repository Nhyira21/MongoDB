from flask import Flask, jsonify, redirect, request, render_template, url_for
from pymongo import MongoClient
app = Flask(__name__)


@app.route('/')
def login():
    return render_template("login.html")

@app.route('/login', methods=['POST'])
def login_handling():
    # Get form data
    username = request.form.get('username')
    password = request.form.get('password')
    
    # Validate user credentials
    # ...
    
    # If successful, redirect to dashboard
    return redirect(url_for('home'))


@app.route('/signup', methods=['POST'])
def signup():
    # Get form data
    username = request.form.get('signupUsername')
    email = request.form.get('signupEmail')
    password = request.form.get('signupPassword')
    
    # Create user account
    # ...
    
    # If successful, redirect to login or dashboard
    return redirect(url_for('home'))

@app.route('/dashboard/')
def home():
    return render_template("index.html")


@app.route('/api/data', methods=['GET'])
def get_data():
    data = list(collection.find({}, {"_id": 0}))  # Exclude the _id field

    return jsonify(data)

@app.route('/api/data', methods=['POST'])
def post_data():
    data = request.get_json()
    if data:
        collection.insert_one(data)
        return jsonify({"message": "Data inserted successfully!"}), 201
    return jsonify({"error": "No data provided"}), 400

@app.route('/api/data/<key>', methods=['DELETE'])
def delete_data(key):
    result = collection.delete_one({"key": key})
    if result.deleted_count > 0:
        return jsonify({"message": "Data deleted successfully!"})
    return jsonify({"error": "Data not found"}), 404




# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["mydatabase"]  # Replace with your database name
collection = db["mycollection"]  # Replace with your collection name


if __name__ == '__main__':
    app.run(debug=True)