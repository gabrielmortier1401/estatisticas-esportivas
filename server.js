const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const app = express();
const port = 3000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Servir arquivos da pasta public/
app.use(express.static(path.join(__dirname, 'public')));

// Rota raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🔍 Rota de busca com filtros opcionais
app.post('/api/buscar', async (req, res) => {
  const { modalidade, equipe, jogador } = req.body;
  console.log("🔍 Requisição recebida:", req.body);

  try {
    const resultado = await prisma.player.findMany({
      where: {
        AND: [
          { modalidade: { equals: modalidade, mode: 'insensitive' } },
          equipe ? { equipe: { contains: equipe, mode: 'insensitive' } } : {},
          jogador ? { jogador: { contains: jogador, mode: 'insensitive' } } : {}
        ]
      }
    });

    res.json(resultado.length ? resultado : { message: 'Nada encontrado.' });
  } catch (err) {
    console.error("❌ Erro ao buscar jogadores:", err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// 🔐 Rota de login com comparação direta de senha (sem hash)
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  console.log("🧪 Tentativa de login:", email);

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && user.senha === senha) {
      res.json({ message: 'Login bem-sucedido!' });
    } else {
      res.json({ message: 'Credenciais inválidas.' });
    }
  } catch (err) {
    console.error("❌ Erro no login:", err);
    res.status(500).json({ error: 'Erro interno ao logar' });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
