const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// Configuração do pool para o PostgreSQL
const pool = new Pool({
  user: 'admin@admin.com',//  usuário do PostgreSQL
  host: '127.0.0.1:5050',
  database: 'postgres',// Nome do banco de dados
  password: 'admin',
});

const app = express();
app.use(bodyParser.json());

// Função para validar os dados recebidos
function validarDados(data) {
  const { nomeCompleto, email, telefone, username, senha, confirmacaoSenha } = data;

  if (!nomeCompleto || !email || !telefone || !username || !senha || !confirmacaoSenha) {
    return { valido: false, mensagem: 'Todos os campos são obrigatórios.' };
  }

  if (senha !== confirmacaoSenha) {
    return { valido: false, mensagem: 'As senhas não coincidem.' };
  }

  return { valido: true };
}

// Rota POST para cadastro de usuário
app.post('/usuarios', async (req, res) => {
  const { nomeCompleto, email, telefone, username, senha, confirmacaoSenha } = req.body;

  // Valida os dados recebidos
  const validacao = validarDados(req.body);
  if (!validacao.valido) {
    return res.status(400).json({ erro: validacao.mensagem });
  }

  try {
    // Verifica se o email já está cadastrado
    const usuarioExistente = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({ erro: 'Email já cadastrado.' });
    }

    // Insere o usuário no banco de dados
    const result = await pool.query(
      'INSERT INTO usuarios (nome_completo, email, telefone, username, senha) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nomeCompleto, email, telefone, username, senha]
    );

    // Retorna sucesso
    res.status(200).json({ mensagem: 'Usuário cadastrado com sucesso!', usuario: result.rows[0] });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
  }
});

// Inicia o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});