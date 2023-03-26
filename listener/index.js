const dgram = require("dgram");
const { Message } = require("./message.js");
const Database = require("../Databases.js");
const listener = dgram.createSocket("udp4");
const message = new Message();
const database = new Database();

function Listener() {
  // Initiates the listener that listens the data coming from the app
  listener.on("listening", async () => {
    const address = listener.address();
    console.log(
      `El listener UDP está escuchando en ${address.address}:${address.port}`
    );
    await database.connection();

  });

  // Prints the message in the console for debugging
  listener.on("message", (msg, rinfo) => {
    console.log(
      `Mensaje recibido desde ${rinfo.address}:${rinfo.port}: ${msg}`
    );
    message.newSnifferMessage(msg);
    database.registroHandler.createQuery(msg.toString("utf8"));
  });

  // Links the port and IP
  listener.bind(1001);
}

module.exports = {
  message,
  Listener,
};
