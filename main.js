const http = require('http');
const dgram = require('dgram');
const listener = dgram.createSocket('udp4');
const fs = require('fs');
const path = require('path');

var mensaje = '1;1;1;1'
listener.on('listening', () => {
    const address = listener.address();
    console.log(`El listener UDP está escuchando en ${address.address}:${address.port}`);
  });

  listener.on('message', (msg, rinfo) => {
    console.log(`Mensaje recibido desde ${rinfo.address}:${rinfo.port}: ${msg}`);
    datogps(msg);
  });

  listener.bind(52022,'192.168.1.16');


  const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
      console.log('Cargando archivo HTML')
      const htmlPath = path.join(__dirname, 'index.html');
      const fileStream = fs.createReadStream(htmlPath);
    fileStream.on('error', (err) => {
      console.log('Error al leer archivo HTML:', err);
      res.writeHead(500);
      res.end('Error interno del servidor');
    });
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fileStream.pipe(res);
/*
      fs.readFile(htmlPath,'UTF-8', (err, data) => {
        console.log('hoola')
        if (err) {
          console.log('error')
          res.writeHead(500);
          res.end('Error interno del servidor');
        } else {
          console.log('success')
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        }
      });

      */
    } else if (req.url === '/estilos.css'){
      const cssPath = path.join(__dirname, 'estilos.css');
/*
    fs.readFile(cssPath,'UTF-8', (err, data) => {
      console.log('cargando css')
      if (err) {
        res.writeHead(500);
        res.end('Error interno del servidor');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(data);
      }
    });
*/
const fileStream = fs.createReadStream(cssPath);
    fileStream.on('error', (err) => {
      console.log('Error al leer archivo CSS:', err);
      res.writeHead(500);
      res.end('Error interno del servidor');
    });
    res.writeHead(200, { 'Content-Type': 'text/css' });
    fileStream.pipe(res);
    }else if (req.url === '/api/valor'){
      console.log('cargando dato');
      if(mensaje != null){
        var gpsdata = mensaje.split(';');
        var gpsjson = {
          latitud: gpsdata[0],
          longitud: gpsdata[1],
          altitud: gpsdata[2],
          timestamp: gpsdata[3]
        };
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(gpsjson));
      }
    }
});

server.listen(51012,'192.168.1.16', () => {
  console.log('El servidor está escuchando en el puerto 51012');
});

async function datogps(msg) {
    mensaje = await msg.toString('utf8');
    try {
        await fs.promises.appendFile('historial.txt',mensaje + "\n");
    } catch (err){
        console.log(err);
    }
}
