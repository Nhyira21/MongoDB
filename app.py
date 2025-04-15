from flask import Flask, jsonify, request, render_template
from pymongo import MongoClient

app = Flask(__name__)


@app.route('/basest')
def basest():
    return render_template("base.html")


@app.route('/')
def login():
    return render_template("login.html")

@app.route('/dashboard/')
def home():
    return render_template("extendsbase.html")
# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["mydatabase"]  # Replace with your database name
collection = db["mycollection"]  # Replace with your collection name

if __name__ == '__main__':
    app.run(debug=True)