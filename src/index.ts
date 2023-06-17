import "dotenv/config.js";
import {Agents} from "./agents";
import {Client, NoAuth} from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const client = new Client({
  authStrategy: new NoAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, {small: true});
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (message) => {
  try {
    console.log(message.body);
    const text = message.body;
    const agents = new Agents();
    const resp = await agents.clasifierAgent(text);
    const rafaResp = await agents.rafaAgent(text, resp);
    await client.sendMessage(
      message.from,
      rafaResp ? rafaResp : "Sin respuesta"
    );
  } catch (error) {
    console.log(error);
  }
});

client.initialize();
