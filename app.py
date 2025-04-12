from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to the Flask API!"})

@app.route('/api/data', methods=['GET'])
def get_data():
    sample_data = {"key": "value", "number": 42}
    return jsonify(sample_data)

@app.route('/api/data', methods=['POST'])
def post_data():
    data = request.get_json()
    return jsonify({"received_data": data}), 201

if __name__ == '__main__':
    app.run(debug=True)