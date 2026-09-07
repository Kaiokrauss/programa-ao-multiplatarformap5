const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'clientes.json');

// Garante que o arquivo de "banco de dados" existe
function garantirArquivo() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, '[]', 'utf-8');
  }
}

function lerClientes() {
  garantirArquivo();
  const conteudo = fs.readFileSync(DB_PATH, 'utf-8');
  try {
    return JSON.parse(conteudo);
  } catch (err) {
    return [];
  }
}

function salvarClientes(clientes) {
  fs.writeFileSync(DB_PATH, JSON.stringify(clientes, null, 2), 'utf-8');
}

function gerarProximoId(clientes) {
  if (clientes.length === 0) return 1;
  const maiorId = clientes.reduce((max, c) => (c.id > max ? c.id : max), 0);
  return maiorId + 1;
}

module.exports = {
  lerClientes,
  salvarClientes,
  gerarProximoId
};
