class Message {
  value = "1;1;1;1";

  newSnifferMessage = async (newMessage) => {
    this.value = await newMessage.toString("utf8");
  
}

};
module.exports = { Message};