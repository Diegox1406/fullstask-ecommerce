const express = require('express');
const cors = require('cors');

const app = express();

// Configurar CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// ...existing code...