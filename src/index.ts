import "dotenv/config.js";
import {Agents} from "./agents";
import TelegramBot from "node-telegram-bot-api";
import express from "express";

if (process.env.TELEGRAM_TOKEN_ACCESS === undefined) {
  throw new Error("TELEGRAM_TOKEN_ACCESS must be provided!");
}

const app = express();
// Create a Telegram bot
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN_ACCESS);
// Start Express Server
app.listen(3000, () => {
  console.log(`Express server is listening on 3000`);
});
app.use(express.json());
// We are receiving updates at the route below!
app.post(`/bot`, (req, res) => {
  try {
    bot.processUpdate(req.body);
  } catch (error) {
    console.log("Error procesando update");
  }
  res.sendStatus(200);
});

app.get(`/`, (req, res) => {
  res.send("Server is up");
});
bot.on("message", async (msg) => {
  console.log("You got a message");
  const text = msg.text;
  const chatId = msg.chat.id;
  if (!text) {
    return await bot.sendMessage(chatId, "Tu mensaje debe contener texto");
  }
  if (msg.text === "/start") {
    return await bot.sendMessage(
      chatId,
      "Soy el bot curricular de Rafael Molina puedes hacerme preguntas sobre sus datos personales, experiencia personal y personalidad,\n" +
        "Recuerda enviar 1 mensaje y esperar la respuesta y no enviar muchos mensajes a la vez ya que puede sobrecargar el servidor"
    );
  } else {
    try {
      const agents = new Agents();
      const resp = await agents.clasifierAgent(text);
      console.log("Categoria", resp);
      const rafaResp = await agents.rafaAgent(text, resp);
      console.log(rafaResp);
      return await bot.sendMessage(
        chatId,
        rafaResp ? rafaResp : "Sin respuesta"
      );
    } catch (error) {
      console.log("Fallo:", error);
      return await bot.sendMessage(chatId, "La api se quedo sin requests");
    }
  }
});
