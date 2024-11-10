# Código Flask atualizado para extração correta do texto da resposta
from flask import Flask, jsonify, request, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
import google.generativeai as genai
import os
from flask_cors import CORS
from dotenv import load_dotenv
import pandas as pd
import markdown
import jwt
import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
model = genai.GenerativeModel("gemini-1.5-flash")

# Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

# Criação da tabela
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


@app.route('/api/chatbot', methods=['POST'])
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
    
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'User already exists'}), 400

    hashed_password = generate_password_hash(password, method='sha256')
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = jwt.encode({'user_id': user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({'token': token}), 200

@app.route('/api/test_db', methods=['GET'])
def test_db():
    try:
        db.session.execute('SELECT 1')
        return jsonify({'message': 'Database connection is working'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)