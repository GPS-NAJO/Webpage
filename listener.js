const dgram = require('dgram');

const server = dgram.createSocket('udp4');

server.on('listening', () => {
  const address = server.address();
  console.log(`El servidor UDP está escuchando en ${address.address}:${address.port}`);
});

server.on('message', (msg, rinfo) => {
  console.log(`Mensaje recibido desde ${rinfo.address}:${rinfo.port}: ${msg}`);
});

server.bind(52022,'192.168.1.16');
