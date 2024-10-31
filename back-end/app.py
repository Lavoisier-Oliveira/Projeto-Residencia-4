# Código Flask atualizado para extração correta do texto da resposta
from flask import Flask, jsonify, request
import google.generativeai as genai
import os
from flask_cors import CORS
from dotenv import load_dotenv
import pandas as pd
import markdown

load_dotenv()

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
model = genai.GenerativeModel("gemini-1.5-flash")

# Lê o conteúdo do Google Sheets
url = 'https://docs.google.com/spreadsheets/d/1i8_Ejx-rJqou_YVehx5el-hu7A-tWpN0xP6wGMGjWtY/export?format=csv'
df = pd.read_csv(url)

# Carregar o histórico de chat
history = []
for index, row in df.iterrows():
    history.append({"role": "user", "parts": row['Mensagem']})
    # history.append({"role": "model", "parts": row['Resposta']})

chat = model.start_chat(history=history)

@app.route('/api/data', methods=['POST'])
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

if __name__ == '__main__':
    app.run(debug=True)