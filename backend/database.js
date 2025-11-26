const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'health_tracker.db');
const db = new sqlite3.Database(dbPath);

// Criar tabelas
db.serialize(() => {
  // Tabela de Exames
  db.run(`CREATE TABLE IF NOT EXISTS exames (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    tipo TEXT,
    data_exame DATE,
    arquivo TEXT,
    observacoes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabela de Treinos
  db.run(`CREATE TABLE IF NOT EXISTS treinos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data DATE NOT NULL,
    tipo TEXT,
    exercicio TEXT NOT NULL,
    series INTEGER,
    repeticoes INTEGER,
    peso REAL,
    duracao INTEGER,
    observacoes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabela de Refeições
  db.run(`CREATE TABLE IF NOT EXISTS refeicoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data DATE NOT NULL,
    tipo_refeicao TEXT NOT NULL,
    alimentos TEXT NOT NULL,
    calorias INTEGER,
    proteinas REAL,
    carboidratos REAL,
    gorduras REAL,
    observacoes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabela de Metas
  db.run(`CREATE TABLE IF NOT EXISTS metas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT,
    tipo TEXT,
    valor_alvo REAL,
    valor_atual REAL DEFAULT 0,
    unidade TEXT,
    data_inicio DATE,
    data_fim DATE,
    status TEXT DEFAULT 'em_andamento',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabela de Doenças Pré-existentes
  db.run(`CREATE TABLE IF NOT EXISTS doencas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    data_diagnostico DATE,
    gravidade TEXT,
    tratamento_atual TEXT,
    observacoes TEXT,
    ativa BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabela de Remédios
  db.run(`CREATE TABLE IF NOT EXISTS remedios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    dosagem TEXT,
    frequencia TEXT,
    horarios TEXT,
    data_inicio DATE,
    data_fim DATE,
    prescrito_por TEXT,
    observacoes TEXT,
    ativo BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabela de Registro Diário (Diário de Saúde)
  db.run(`CREATE TABLE IF NOT EXISTS registro_diario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data DATE NOT NULL,
    peso REAL,
    pressao_arterial TEXT,
    temperatura REAL,
    humor TEXT,
    nivel_energia INTEGER,
    horas_sono REAL,
    qualidade_sono TEXT,
    sintomas TEXT,
    observacoes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  console.log('Banco de dados inicializado com sucesso!');
});

module.exports = db;
