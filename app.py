from flask import Flask, jsonify, request, render_template
from pymongo import MongoClient

app = Flask(__name__)

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["mydatabase"]  # Replace with your database name
collection = db["mycollection"]  # Replace with your collection name

@app.route('/')
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

if __name__ == '__main__':
    app.run(debug=True)