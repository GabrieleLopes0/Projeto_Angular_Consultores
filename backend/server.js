const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/consultores';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Schema do Consultor
const consultorSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  telefone: {
    type: String,
    required: true,
    trim: true
  },
  areaEspecializacao: {
    type: String,
    required: true,
    trim: true
  },
  dataCadastro: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Consultor = mongoose.model('Consultor', consultorSchema);

// Rotas da API

// GET /api/consultores - Listar todos os consultores
app.get('/api/consultores', async (req, res) => {
  try {
    const { busca, area } = req.query;
    let query = {};

    if (busca) {
      query.$or = [
        { nome: { $regex: busca, $options: 'i' } },
        { email: { $regex: busca, $options: 'i' } }
      ];
    }

    if (area) {
      query.areaEspecializacao = { $regex: area, $options: 'i' };
    }

    const consultores = await Consultor.find(query).sort({ dataCadastro: -1 });
    res.json(consultores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/consultores/:id - Obter um consultor por ID
app.get('/api/consultores/:id', async (req, res) => {
  try {
    const consultor = await Consultor.findById(req.params.id);
    if (!consultor) {
      return res.status(404).json({ error: 'Consultor não encontrado' });
    }
    res.json(consultor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/consultores - Criar um novo consultor
app.post('/api/consultores', async (req, res) => {
  try {
    const { nome, email, telefone, areaEspecializacao } = req.body;

    // Validação básica
    if (!nome || !email || !telefone || !areaEspecializacao) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const consultor = new Consultor({
      nome,
      email,
      telefone,
      areaEspecializacao
    });

    await consultor.save();
    res.status(201).json(consultor);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/consultores/:id - Atualizar um consultor
app.put('/api/consultores/:id', async (req, res) => {
  try {
    const { nome, email, telefone, areaEspecializacao } = req.body;

    const consultor = await Consultor.findByIdAndUpdate(
      req.params.id,
      { nome, email, telefone, areaEspecializacao },
      { new: true, runValidators: true }
    );

    if (!consultor) {
      return res.status(404).json({ error: 'Consultor não encontrado' });
    }

    res.json(consultor);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/consultores/:id - Excluir um consultor
app.delete('/api/consultores/:id', async (req, res) => {
  try {
    const consultor = await Consultor.findByIdAndDelete(req.params.id);
    if (!consultor) {
      return res.status(404).json({ error: 'Consultor não encontrado' });
    }
    res.json({ message: 'Consultor excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API Consultores está funcionando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

