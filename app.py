from flask import Flask, jsonify, request, render_template
from pymongo import MongoClient

app = Flask(__name__)
# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["toyforge"]  # Replace with your database name
user_collection = db["users"]  # Replace with your collection name



@app.route('/basest')
def basest():
    return render_template("base.html")


@app.route('/')
def login():
    return render_template("login.html")

@app.route('/login', methods=['POST'])
def login_post():
    # Fetch data from the ajax json form
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    print(username, password, ":::::::::::::::::::::::::::::::::::::::::::")

    # fetch all users from mongodb collection
    users = user_collection.find()
    for user in users:
        print(user, ":::::::::::::::::::::::::::::::::::::::::::")
        # Check if the username and password match
        if user['name'] == username and user['password'] == password:
            return jsonify({"message": "Login successful"}), 200
        else:
            print("f**^ ::::::::::::::::::")
            return jsonify({"message": "Invalid username or password"}), 401
    

@app.route('/signup', methods=['POST'])
def signup():
    return render_template("base.html")
@app.route('/dashboard/')
def home():
    return render_template("extendsbase.html")

if __name__ == '__main__':
    app.run(debug=True)