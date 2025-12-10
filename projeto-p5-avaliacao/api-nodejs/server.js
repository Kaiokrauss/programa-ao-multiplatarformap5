const express = require('express');
const cors = require('cors');
const amqp = require('amqplib');
const app = express();

app.use(cors());
app.use(express.json());

let clientes = [];
let idCounter = 1;

const RABBITMQ_URL = 'amqp://localhost:5672';
let channel = null;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue('clientes_cadastrados', { durable: true });
    console.log('✅ Conectado ao RabbitMQ');
  } catch (error) {
    console.log('⚠️  RabbitMQ não disponível, continuando sem mensageria');
  }
}

async function enviarMensagem(nomeCliente) {
  if (channel) {
    try {
      channel.sendToQueue(
        'clientes_cadastrados',
        Buffer.from(JSON.stringify({ nome: nomeCliente, timestamp: new Date() })),
        { persistent: true }
      );
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  }
}

app.post('/api/inserir', async (req, res) => {
  try {
    const { nome, telefone, email, endereco, cidade, estado } = req.body;
    
    if (!nome || !email) {
      return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
    }

    const novoCliente = {
      id: idCounter++,
      nome,
      telefone,
      email,
      endereco,
      cidade,
      estado
    };

    clientes.push(novoCliente);
    await enviarMensagem(nome);
    
    res.status(201).json({ mensagem: 'Cliente inserido com sucesso', cliente: novoCliente });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao inserir cliente' });
  }
});

app.put('/api/alterar', (req, res) => {
  try {
    const { id, nome, telefone, email, endereco, cidade, estado } = req.body;
    const index = clientes.findIndex(c => c.id === id);
    
    if (index === -1) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    clientes[index] = { id, nome, telefone, email, endereco, cidade, estado };
    res.json({ mensagem: 'Cliente alterado com sucesso', cliente: clientes[index] });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao alterar cliente' });
  }
});

app.delete('/api/excluir/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = clientes.findIndex(c => c.id === id);
    
    if (index === -1) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    const clienteRemovido = clientes.splice(index, 1);
    res.json({ mensagem: 'Cliente excluído com sucesso', cliente: clienteRemovido[0] });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir cliente' });
  }
});

app.get('/api/consultar/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const cliente = clientes.find(c => c.id === id);
    
    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao consultar cliente' });
  }
});

app.get('/api/consultartodos', (req, res) => {
  try {
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao consultar clientes' });
  }
});

const PORT = 3001;
connectRabbitMQ().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
});
