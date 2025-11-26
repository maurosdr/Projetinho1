const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// ===== ROTAS DE EXAMES =====
app.get('/api/exames', (req, res) => {
  db.all('SELECT * FROM exames ORDER BY data_exame DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/exames', upload.single('arquivo'), (req, res) => {
  const { titulo, tipo, data_exame, observacoes } = req.body;
  const arquivo = req.file ? req.file.filename : null;

  db.run(
    'INSERT INTO exames (titulo, tipo, data_exame, arquivo, observacoes) VALUES (?, ?, ?, ?, ?)',
    [titulo, tipo, data_exame, arquivo, observacoes],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Exame adicionado com sucesso!' });
    }
  );
});

app.delete('/api/exames/:id', (req, res) => {
  db.run('DELETE FROM exames WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Exame removido com sucesso!' });
  });
});

// ===== ROTAS DE TREINOS =====
app.get('/api/treinos', (req, res) => {
  db.all('SELECT * FROM treinos ORDER BY data DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/treinos', (req, res) => {
  const { data, tipo, exercicio, series, repeticoes, peso, duracao, observacoes } = req.body;

  db.run(
    'INSERT INTO treinos (data, tipo, exercicio, series, repeticoes, peso, duracao, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [data, tipo, exercicio, series, repeticoes, peso, duracao, observacoes],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Treino adicionado com sucesso!' });
    }
  );
});

app.delete('/api/treinos/:id', (req, res) => {
  db.run('DELETE FROM treinos WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Treino removido com sucesso!' });
  });
});

// ===== ROTAS DE REFEIÇÕES =====
app.get('/api/refeicoes', (req, res) => {
  db.all('SELECT * FROM refeicoes ORDER BY data DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/refeicoes', (req, res) => {
  const { data, tipo_refeicao, alimentos, calorias, proteinas, carboidratos, gorduras, observacoes } = req.body;

  db.run(
    'INSERT INTO refeicoes (data, tipo_refeicao, alimentos, calorias, proteinas, carboidratos, gorduras, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [data, tipo_refeicao, alimentos, calorias, proteinas, carboidratos, gorduras, observacoes],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Refeição adicionada com sucesso!' });
    }
  );
});

app.delete('/api/refeicoes/:id', (req, res) => {
  db.run('DELETE FROM refeicoes WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Refeição removida com sucesso!' });
  });
});

// ===== ROTAS DE METAS =====
app.get('/api/metas', (req, res) => {
  db.all('SELECT * FROM metas ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/metas', (req, res) => {
  const { titulo, descricao, tipo, valor_alvo, valor_atual, unidade, data_inicio, data_fim, status } = req.body;

  db.run(
    'INSERT INTO metas (titulo, descricao, tipo, valor_alvo, valor_atual, unidade, data_inicio, data_fim, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [titulo, descricao, tipo, valor_alvo, valor_atual, unidade, data_inicio, data_fim, status],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Meta adicionada com sucesso!' });
    }
  );
});

app.put('/api/metas/:id', (req, res) => {
  const { valor_atual, status } = req.body;

  db.run(
    'UPDATE metas SET valor_atual = ?, status = ? WHERE id = ?',
    [valor_atual, status, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Meta atualizada com sucesso!' });
    }
  );
});

app.delete('/api/metas/:id', (req, res) => {
  db.run('DELETE FROM metas WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Meta removida com sucesso!' });
  });
});

// ===== ROTAS DE DOENÇAS =====
app.get('/api/doencas', (req, res) => {
  db.all('SELECT * FROM doencas ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/doencas', (req, res) => {
  const { nome, data_diagnostico, gravidade, tratamento_atual, observacoes, ativa } = req.body;

  db.run(
    'INSERT INTO doencas (nome, data_diagnostico, gravidade, tratamento_atual, observacoes, ativa) VALUES (?, ?, ?, ?, ?, ?)',
    [nome, data_diagnostico, gravidade, tratamento_atual, observacoes, ativa],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Doença adicionada com sucesso!' });
    }
  );
});

app.delete('/api/doencas/:id', (req, res) => {
  db.run('DELETE FROM doencas WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Doença removida com sucesso!' });
  });
});

// ===== ROTAS DE REMÉDIOS =====
app.get('/api/remedios', (req, res) => {
  db.all('SELECT * FROM remedios ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/remedios', (req, res) => {
  const { nome, dosagem, frequencia, horarios, data_inicio, data_fim, prescrito_por, observacoes, ativo } = req.body;

  db.run(
    'INSERT INTO remedios (nome, dosagem, frequencia, horarios, data_inicio, data_fim, prescrito_por, observacoes, ativo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [nome, dosagem, frequencia, horarios, data_inicio, data_fim, prescrito_por, observacoes, ativo],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Remédio adicionado com sucesso!' });
    }
  );
});

app.delete('/api/remedios/:id', (req, res) => {
  db.run('DELETE FROM remedios WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Remédio removido com sucesso!' });
  });
});

// ===== ROTAS DE REGISTRO DIÁRIO =====
app.get('/api/registro-diario', (req, res) => {
  db.all('SELECT * FROM registro_diario ORDER BY data DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/registro-diario', (req, res) => {
  const { data, peso, pressao_arterial, temperatura, humor, nivel_energia, horas_sono, qualidade_sono, sintomas, observacoes } = req.body;

  db.run(
    'INSERT INTO registro_diario (data, peso, pressao_arterial, temperatura, humor, nivel_energia, horas_sono, qualidade_sono, sintomas, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [data, peso, pressao_arterial, temperatura, humor, nivel_energia, horas_sono, qualidade_sono, sintomas, observacoes],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Registro diário adicionado com sucesso!' });
    }
  );
});

app.delete('/api/registro-diario/:id', (req, res) => {
  db.run('DELETE FROM registro_diario WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Registro removido com sucesso!' });
  });
});

// ===== ROTAS DE PACIENTES =====
app.get('/api/pacientes', (req, res) => {
  db.all('SELECT * FROM pacientes ORDER BY nome ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/pacientes/:id', (req, res) => {
  db.get('SELECT * FROM pacientes WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Paciente não encontrado' });
    res.json(row);
  });
});

app.post('/api/pacientes', (req, res) => {
  const { nome, data_nascimento, cpf, email, telefone, tipo_sanguineo, observacoes } = req.body;

  db.run(
    'INSERT INTO pacientes (nome, data_nascimento, cpf, email, telefone, tipo_sanguineo, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [nome, data_nascimento, cpf, email, telefone, tipo_sanguineo, observacoes],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Paciente adicionado com sucesso!' });
    }
  );
});

app.delete('/api/pacientes/:id', (req, res) => {
  db.run('DELETE FROM pacientes WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Paciente removido com sucesso!' });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});
