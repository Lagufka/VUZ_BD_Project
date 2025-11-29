# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS  # для обработки CORS

app = Flask(__name__)
CORS(app)  # Разрешаем запросы с других доменов

@app.route('/api/data', methods=['GET'])
def get_data():
    data = {
        'message': 'Hello from Flask!',
        'status': 'success'
    }
    return jsonify(data)

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    # Обработка данных
    return jsonify({'message': 'User created', 'data': data})

if __name__ == '__main__':
    app.run(debug=True, port=5000)