import dgram from "dgram";
import config from "../scripts/index.js";
import { Message } from "./message.js";

const listener = dgram.createSocket("udp4");

export const message = new Message();

function Listener() {
  // Inicia el listener que escucha para los datos udp provenientes de la app
  listener.on("listening", () => {
    const address = listener.address();
    console.log(
      `El listener UDP está escuchando en ${address.address}:${address.port}`
    );
  });

  //Imprime mensaje en consola para efectos de depuracion
  listener.on("message", (msg, rinfo) => {
    console.log(`Mensaje recibido desde ${rinfo.address}:${rinfo.port}: ${msg}`);
    message.newSnifferMessage(msg);
  });

  // Vincula el puerto e ip
  listener.bind(config.SNIFFER_PORT, config.IP_LOCAL);
}

export default Listener;