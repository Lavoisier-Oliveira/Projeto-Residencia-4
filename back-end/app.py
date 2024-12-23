from flask import Flask, jsonify, request, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import google.generativeai as genai
import os
from flask_cors import CORS
from dotenv import load_dotenv
import pandas as pd
import markdown
import datetime
import jwt

load_dotenv()

app = Flask(__name__)
CORS(app)

genai.configure(api_key='AIzaSyA9BywR_q8RVIoxzIoPc_JqQztLTJNl2Rk')
model = genai.GenerativeModel("gemini-1.5-flash")

# Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@database:5432/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'secret'
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    telefone = db.Column(db.String(20), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    data_de_criacao = db.Column(db.DateTime, default=datetime.datetime.utcnow)

with app.app_context():
    db.create_all()

# Lê o conteúdo do Google Sheets
url = 'https://docs.google.com/spreadsheets/d/1i8_Ejx-rJqou_YVehx5el-hu7A-tWpN0xP6wGMGjWtY/export?format=csv'
df = pd.read_csv(url)

# Carregar o histórico de chat
history = []
for index, row in df.iterrows():
    history.append({"role": "user", "parts": row['Mensagem']})
    # history.append({"role": "model", "parts": row['Resposta']})

chat = model.start_chat(history=history)


@app.route('/chat', methods=['POST'])
def query_bot():
    data = request.get_json()
    consulta = data.get('consulta', '')

    if not consulta:
        return jsonify({'error': 'No query provided.'}), 400

    try:
        # Envia a consulta para o chatbot e obtém a resposta
        response = chat.send_message(consulta)
        
        response_text = markdown.markdown(response.text)
        
        return jsonify({'response': response_text})
    except Exception as e:
        print("Error while processing request:", e)
        return jsonify({'error': 'Could not retrieve response from bot'}), 500
    
@app.route('/cadastro', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        nome = data.get('nome')
        email = data.get('email')
        telefone = data.get('telefone')
        username = data.get('username')
        password = data.get('password')

        if not nome or not email or not telefone or not username or not password:
            return jsonify({'error': 'All fields are required'}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already exists'}), 400

        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 400

        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_user = User(nome=nome, email=email, telefone=telefone, username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User registered successfully'}), 201
    
    except Exception as e:
        print(f"Error during registration: {e}")
        return jsonify({'error': 'Internal Server Error', 'message': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        user = User.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password, password):
            return jsonify({'error': 'Invalid credentials'}), 401

        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({'token': token}), 200

    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({'error': 'Internal Server Error', 'message': str(e)}), 500

@app.route('/api/test_db', methods=['GET'])
def test_db():
    try:
        db.session.execute(text('SELECT 1'))
        return jsonify({'message': 'Database connection is working'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)