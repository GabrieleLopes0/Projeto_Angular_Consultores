const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

let admin = null;
try {
  admin = require('firebase-admin');
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
      })
    });
    console.log('Firebase Admin SDK inicializado');
  } else {
    console.log('Firebase Admin SDK não configurado - exclusão de credenciais desabilitada');
  }
} catch (error) {
  console.log('Firebase Admin SDK não disponível - exclusão de credenciais desabilitada');
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://seu-usuario.github.io',
    /^https:\/\/.*\.github\.io$/,
    /^https:\/\/.*\.onrender\.com$/
  ],
  credentials: true
}));
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/consultores';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

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

app.post('/api/consultores', async (req, res) => {
  try {
    const { nome, email, telefone, areaEspecializacao } = req.body;

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

app.delete('/api/consultores/:id', async (req, res) => {
  try {
    const consultor = await Consultor.findById(req.params.id);
    if (!consultor) {
      return res.status(404).json({ error: 'Consultor não encontrado' });
    }

    const email = consultor.email;

    await Consultor.findByIdAndDelete(req.params.id);

    let firebaseDeleted = false;
    if (admin) {
      try {
        const userRecord = await admin.auth().getUserByEmail(email);
        await admin.auth().deleteUser(userRecord.uid);
        console.log(`Credencial do Firebase deletada para: ${email}`);
        firebaseDeleted = true;
      } catch (firebaseError) {
        if (firebaseError.code === 'auth/user-not-found') {
          console.log(`Usuário não encontrado no Firebase: ${email}`);
          firebaseDeleted = true;
        } else {
          console.error('Erro ao deletar credencial do Firebase:', firebaseError.message);
          console.error('Detalhes do erro:', firebaseError);
        }
      }
    } else {
      console.warn(`⚠️  Firebase Admin SDK não configurado. Credencial do Firebase NÃO foi deletada para: ${email}`);
      console.warn('Para habilitar exclusão automática, configure as variáveis FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY e FIREBASE_CLIENT_EMAIL no arquivo .env');
    }

    if (firebaseDeleted) {
      res.json({ message: 'Consultor e credencial do Firebase excluídos com sucesso' });
    } else {
      res.json({ 
        message: 'Consultor excluído do banco de dados. A credencial do Firebase pode ainda existir.',
        warning: 'Firebase Admin SDK não configurado ou erro ao deletar credencial'
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'API Consultores está funcionando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

