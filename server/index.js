import fs from "fs";
import http from "http";
import path from "path";
import { message } from "../sniffer/index.js";
import config from "../scripts/index.js";

let __dirname = path.resolve();

const server = http.createServer(async (req, res) => {
  if (req.url === "/") {
    const htmlPath = path.join(__dirname, "./public/index.html");
    const fileStream = fs.createReadStream(htmlPath);
    fileStream.on("error", (err) => {
      console.log("Error al leer archivo HTML:", err);
      res.writeHead(500);
      res.end("Error interno del servidor");
    });
    res.writeHead(200, { "Content-Type": "text/html" });
    fileStream.pipe(res);
  } else if (req.url === "/styles.css") {
    const cssPath = path.join(__dirname, "./public/styles.css");

    const fileStream = fs.createReadStream(cssPath);
    fileStream.on("error", (err) => {
      console.log("Error al leer archivo CSS:", err);
      res.writeHead(500);
      res.end("Error interno del servidor");
    });
    res.writeHead(200, { "Content-Type": "text/css" });
    fileStream.pipe(res);
  } else if (req.url === "/api/valor") {
    if (message.value != null) {
      var gpsdata = message.value.split(";");
      var gpsjson = {
        latitud: gpsdata[0],
        longitud: gpsdata[1],
        altitud: gpsdata[2],
        timestamp: parseInt(gpsdata[3], 10),
      };
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(gpsjson));
    }
  }
});

server.listen(config.SERVER_PORT, config.IP_LOCAL, () => {
  console.log("El servidor está escuchando en el puerto 51012");
});
