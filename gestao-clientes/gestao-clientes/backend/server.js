const express = require('express');
const cors = require('cors');
const { lerClientes, salvarClientes, gerarProximoId } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Função utilitária para validar os campos obrigatórios do cliente
function validarCliente(body) {
  const camposObrigatorios = ['nome', 'telefone', 'email', 'endereco', 'cidade', 'estado'];
  const faltando = camposObrigatorios.filter((campo) => !body[campo] || String(body[campo]).trim() === '');
  return faltando;
}

// Rota raiz - apenas para checar se a API está no ar
app.get('/', (req, res) => {
  res.json({ mensagem: 'API de Gestão de Clientes rodando com sucesso!' });
});

// ----------------------------------------------------------------
// /api/inserir -> inserir os dados do cliente
// ----------------------------------------------------------------
app.post('/api/inserir', (req, res) => {
  const faltando = validarCliente(req.body);
  if (faltando.length > 0) {
    return res.status(400).json({
      erro: 'Campos obrigatórios não informados',
      campos: faltando
    });
  }

  const clientes = lerClientes();

  const novoCliente = {
    id: gerarProximoId(clientes),
    nome: req.body.nome,
    telefone: req.body.telefone,
    email: req.body.email,
    endereco: req.body.endereco,
    cidade: req.body.cidade,
    estado: req.body.estado
  };

  clientes.push(novoCliente);
  salvarClientes(clientes);

  return res.status(201).json({
    mensagem: 'Cliente inserido com sucesso',
    cliente: novoCliente
  });
});

// ----------------------------------------------------------------
// /api/alterar -> alterar os dados do cliente
// ----------------------------------------------------------------
function alterarCliente(req, res) {
  const id = req.body.id ?? req.params.id;

  if (!id) {
    return res.status(400).json({ erro: 'O campo "id" é obrigatório para alterar um cliente' });
  }

  const clientes = lerClientes();
  const indice = clientes.findIndex((c) => c.id === Number(id));

  if (indice === -1) {
    return res.status(404).json({ erro: `Cliente com id ${id} não encontrado` });
  }

  const clienteAtual = clientes[indice];

  const clienteAtualizado = {
    id: clienteAtual.id,
    nome: req.body.nome ?? clienteAtual.nome,
    telefone: req.body.telefone ?? clienteAtual.telefone,
    email: req.body.email ?? clienteAtual.email,
    endereco: req.body.endereco ?? clienteAtual.endereco,
    cidade: req.body.cidade ?? clienteAtual.cidade,
    estado: req.body.estado ?? clienteAtual.estado
  };

  clientes[indice] = clienteAtualizado;
  salvarClientes(clientes);

  return res.json({
    mensagem: 'Cliente alterado com sucesso',
    cliente: clienteAtualizado
  });
}

app.put('/api/alterar', alterarCliente);
// Também aceita o id na URL, por conveniência: PUT /api/alterar/1
app.put('/api/alterar/:id', alterarCliente);

// ----------------------------------------------------------------
// /api/excluir -> excluir os dados do cliente
// ----------------------------------------------------------------
app.delete('/api/excluir', (req, res) => {
  const id = req.body.id ?? req.query.id;

  if (!id) {
    return res.status(400).json({ erro: 'O campo "id" é obrigatório para excluir um cliente' });
  }

  const clientes = lerClientes();
  const indice = clientes.findIndex((c) => c.id === Number(id));

  if (indice === -1) {
    return res.status(404).json({ erro: `Cliente com id ${id} não encontrado` });
  }

  const [clienteRemovido] = clientes.splice(indice, 1);
  salvarClientes(clientes);

  return res.json({
    mensagem: 'Cliente excluído com sucesso',
    cliente: clienteRemovido
  });
});

// Também permite excluir usando o id na URL: DELETE /api/excluir/:id
app.delete('/api/excluir/:id', (req, res) => {
  const id = req.params.id;
  const clientes = lerClientes();
  const indice = clientes.findIndex((c) => c.id === Number(id));

  if (indice === -1) {
    return res.status(404).json({ erro: `Cliente com id ${id} não encontrado` });
  }

  const [clienteRemovido] = clientes.splice(indice, 1);
  salvarClientes(clientes);

  return res.json({
    mensagem: 'Cliente excluído com sucesso',
    cliente: clienteRemovido
  });
});

// ----------------------------------------------------------------
// /api/consultar -> consultar os dados de um cliente por Id
// ----------------------------------------------------------------
app.get('/api/consultar/:id', (req, res) => {
  const { id } = req.params;
  const clientes = lerClientes();
  const cliente = clientes.find((c) => c.id === Number(id));

  if (!cliente) {
    return res.status(404).json({ erro: `Cliente com id ${id} não encontrado` });
  }

  return res.json(cliente);
});

// Também aceita a consulta via querystring: /api/consultar?id=1
app.get('/api/consultar', (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ erro: 'Informe o id do cliente. Ex: /api/consultar?id=1' });
  }

  const clientes = lerClientes();
  const cliente = clientes.find((c) => c.id === Number(id));

  if (!cliente) {
    return res.status(404).json({ erro: `Cliente com id ${id} não encontrado` });
  }

  return res.json(cliente);
});

// ----------------------------------------------------------------
// /api/consultartodos -> consultar os dados de todos os clientes
// ----------------------------------------------------------------
app.get('/api/consultartodos', (req, res) => {
  const clientes = lerClientes();
  return res.json(clientes);
});

app.listen(PORT, () => {
  console.log(`API de Gestão de Clientes rodando em http://localhost:${PORT}`);
});
