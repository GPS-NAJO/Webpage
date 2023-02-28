import fs from "fs";

export class Message {
  value = "1;1;1;1";

  newSnifferMessage = async (newMessage) => {
    this.value = await newMessage.toString("utf8");
    try {
      await fs.promises.appendFile("historial.txt", this.value + "\n");
    } catch (err) {
      console.log(err);
    }
  };
}
