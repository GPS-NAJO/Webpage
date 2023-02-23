const http = require('http');
const dgram = require('dgram');
const listener = dgram.createSocket('udp4');
const fs = require('fs/promises');

var mensaje = null
listener.on('listening', () => {
    const address = listener.address();
    console.log(`El servidor UDP está escuchando en ${address.address}:${address.port}`);
  });

  listener.on('message', (msg, rinfo) => {
    console.log(`Mensaje recibido desde ${rinfo.address}:${rinfo.port}: ${msg}`);
    datogps(msg);
  });

  listener.bind(52022,'192.168.1.16');


  const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
      try {
        const msj = await mensaje
        const msjJSON = JSON.stringify(msj);
        res.setHeader('Content-Type', 'application/json');
        res.end(msjJSON);
      } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    }
  });
  
server.listen(51012,'192.168.1.16', () => {
  console.log('El servidor está escuchando en el puerto 51012');
});

async function datogps(msg) {
    mensaje = await msg;
    try {
        await fs.appendFile('historial.txt',mensaje + "\n");
    } catch (err){
        console.log(err);
    }
}
