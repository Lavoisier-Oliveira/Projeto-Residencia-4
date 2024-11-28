CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE historico_conversas (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    mensagem_usuario TEXT NOT NULL,
    resposta_chatbot TEXT NOT NULL,
    tipo_mensagem VARCHAR(20) DEFAULT 'texto', -- Novo campo
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
CREATE INDEX idx_usuario_id ON historico_conversas(usuario_id);


CREATE TABLE mensagens_pre_programadas (
    id SERIAL PRIMARY KEY,
    chave VARCHAR(50) UNIQUE NOT NULL,
    mensagem TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_chave ON mensagens_pre_programadas(chave);


