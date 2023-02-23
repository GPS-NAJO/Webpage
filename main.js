const http = require('http');
const dgram = require('dgram');
const listener = dgram.createSocket('udp4');
const fs = require('fs');
const path = require('path');

var mensaje = '1;1;1;1' // Inicio de mensaje


/*

Inicia el listener que escucha para los datos udp provenientes de la app

*/
listener.on('listening', () => {
    const address = listener.address();
    console.log(`El listener UDP está escuchando en ${address.address}:${address.port}`);
  });



  /*

  Imprime mensaje en consola para efectos de depuracion

*/
  listener.on('message', (msg, rinfo) => {
    console.log(`Mensaje recibido desde ${rinfo.address}:${rinfo.port}: ${msg}`);
    datogps(msg);
  });

  listener.bind(52022,'192.168.1.16'); // Vincula el puerto e ip


  const server = http.createServer(async (req, res) => {


    if (req.url === '/') {

      const htmlPath = path.join(__dirname, 'index.html');
      const fileStream = fs.createReadStream(htmlPath);
    fileStream.on('error', (err) => {
      console.log('Error al leer archivo HTML:', err);
      res.writeHead(500);
      res.end('Error interno del servidor');
    });
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fileStream.pipe(res);


    } else if (req.url === '/estilos.css'){

      const cssPath = path.join(__dirname, 'estilos.css');

      const fileStream = fs.createReadStream(cssPath);
    fileStream.on('error', (err) => {
      console.log('Error al leer archivo CSS:', err);
      res.writeHead(500);
      res.end('Error interno del servidor');
    });
    res.writeHead(200, { 'Content-Type': 'text/css' });
    fileStream.pipe(res);

    }else if (req.url === '/api/valor'){

      if(mensaje != null){
        var gpsdata = mensaje.split(';');
        var gpsjson = {
          latitud: gpsdata[0],
          longitud: gpsdata[1],
          altitud: gpsdata[2],
          timestamp: parseInt(gpsdata[3],10)
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
