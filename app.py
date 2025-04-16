import datetime
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
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    print(data, "::::::::::::::::::::::::::::::::::::::::")
    users = user_collection.find()
    for user in users:
        if user['name'] == username and user['password'] == password:
            session['user'] = username
            return jsonify({"message": "Login successful"}), 200

    # Return a proper error response
    return jsonify({"error": "Invalid username or password"}), 401



@app.route('/signup', methods=['POST'])
def signup():
    # Fetch data from the ajax json form
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    today = datetime.datetime.now()
    today = today.strftime("%Y-%m-%d %H:%M:%S")
    # Check if the username already exists
    if user_collection.find_one({'name': username}):
        return jsonify({"error": "Username already exists"}), 409


    # Insert the new user into the database
    new_user = {'name': username,'email': email, 'status':'active', 'password': password, 'created_at': today}
    session['user'] = username
    session['email'] = email
    user_collection.insert_one(new_user)

    return jsonify({"message": "Account created successfully"}), 201


# ::::::::::::::::  --  l o g i n  &  s i g n u p 






# :::::::::::::::::::::::::::::::::::::::   D A S H B O A R D   :::::::::::::::::::::::::::::::::::::::::: #
@app.route('/dashboard/')
def home():
    return render_template("extendsbase.html")


@app.route('/edituser', methods=['POST'])
def edituser():
    data  = request.get_json()
    data['status'] = 'active'
    print(data['name'], "::::::::::::::::::::::::::::::::::::::::")
    filter = {'name': session['user']}
    user = user_collection.find_one_and_update(
        filter,
        {'$set': data},
        return_document=True
    )
    session['user'] = data['name']
    session['email'] = data['email']
    print(user_collection.find(), "::::::::::::::::::::::::::::::::::::::::")
    return jsonify({"message": "Edit successful"}), 201


# ::::::::::::::::  --  d a s h b o sa r d 






# :::::::::::::::::::::::::::::::::::::::    P R O D U C T S    :::::::::::::::::::::::::::::::::::::::::: #

@app.route('/products/')
def products():
    product_collection = db["products"]
    products = product_collection.find()

    return render_template('product_listing.html', products=products)

@app.route('/products/save', methods=['POST'])
def save_product():
    data = request.get_json()
    product_collection = db["products"]
    product_collection.insert_one(data)
    return jsonify({"message": "Product added successfully"}), 201

@app.route('/products/edit', methods=['POST'])
def edit_product():
    data = request.get_json()
    product_collection = db["products"]
    product_id = data.get('id')
    print(data.get('id'), "::::::::::::::::::::::::::::::::::::::::")
    del data['id']
    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400
    filter = {'id': product_id}
    product_collection.find_one_and_update(filter, {'$set': data})
    return jsonify({"message": "Product updated successfully"}), 201

# ::::::::::::::::  --  p r o d u c t s




# ::::::::::::::::::::::::::::::::::::::::  C A T E G O R I E S  ::::::::::::::::::::::::::::::::::::::::::: #
@app.route('/categories/')
def categories():
    return render_template('categories.html')


# ::::::::::::::::  --  c a t e g o r i e s


# ::::::::::::::::::::::::::::::::::::::  S A L E S  -   R E P O R T  ::::::::::::::::::::::::::::::::::::: #
@app.route('/salesreport/')
def salesreport():
    return render_template('sales_report.html')




if __name__ == '__main__':
    app.run(debug=True)