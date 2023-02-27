import dotenv from "dotenv";
dotenv.config();

export default {
  SNIFFER_PORT: process.env.SNIFFER_PORT,
  IP_LOCAL: process.env.IP_LOCAL,
  SERVER_PORT: process.env.SERVER_PORT,
};
