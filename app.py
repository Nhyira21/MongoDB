from flask import Flask, jsonify, request, render_template, session
from pymongo import MongoClient

app = Flask(__name__)
app.secret_key = 'f8a9c4d6e9b7a2c3e5d8f0a1b4c6d7e8f9a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6'


# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["toyforge"]  # Replace with your database name
user_collection = db["users"]  # Replace with your collection name



@app.route('/basest')
def basest():
    return render_template("base.html")


# ::::::::::::::::::::::::::::::::::::  L O G I N  &  S I G N U P   :::::::::::::::::::::::::::::::::::::::  #
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
            session['user'] = username
            
            return jsonify({"message": "Login successful"}), 200
        else:
            print("f**^ ::::::::::::::::::")
            return jsonify({"error": "Invalid username or password"}), 401
    

@app.route('/signup', methods=['POST'])
def signup():
    return render_template("base.html")


@app.route('/edituser', methods=['POST'])
def edituser():
    data  = request.get_json()
    filter = {'name': data['username']}
    user = user_collection.find_one_and_update
    print(data)
    return jsonify({"message": "Edit successful"}), 201


# ::::::::::::::::  --  l o g i n  &  s i g n u p 






# :::::::::::::::::::::::::::::::::::::::   D A S H B O A R D   :::::::::::::::::::::::::::::::::::::::::: #
@app.route('/dashboard/')
def home():
    return render_template("extendsbase.html")


# ::::::::::::::::  --  d a s h b o a r d 






# :::::::::::::::::::::::::::::::::::::::    P R O D U C T S    :::::::::::::::::::::::::::::::::::::::::: #

@app.route('/products/')
def products():
    return render_template('product_listing.html')

# ::::::::::::::::  --  p r o d u c t s







if __name__ == '__main__':
    app.run(debug=True)