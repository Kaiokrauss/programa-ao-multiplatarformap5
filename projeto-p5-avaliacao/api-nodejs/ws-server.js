const WebSocket = require('ws');
const amqp = require('amqplib');

const wss = new WebSocket.Server({ port: 8080 });

async function consumirFila() {
  try {
    const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();
    
    await channel.assertQueue('clientes_cadastrados', { durable: true });
    console.log('✅ WebSocket conectado ao RabbitMQ');

    channel.consume('clientes_cadastrados', (msg) => {
      if (msg !== null) {
        const dados = JSON.parse(msg.content.toString());
        
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(dados));
          }
        });
        
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('❌ Erro ao conectar RabbitMQ:', error);
  }
}

wss.on('connection', (ws) => {
  console.log('🔌 Cliente WebSocket conectado');
  ws.on('close', () => console.log('🔌 Cliente desconectado'));
});

consumirFila();
console.log('🚀 WebSocket Server rodando na porta 8080');
