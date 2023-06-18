import "dotenv/config.js";
import {Agents} from "./agents";
import TelegramBot from "node-telegram-bot-api";

if (process.env.TELEGRAM_TOKEN_ACCESS === undefined) {
  throw new Error("TELEGRAM_TOKEN_ACCESS must be provided!");
}
// Create a Telegram bot
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN_ACCESS, {polling: true});

bot.on("message", async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  if (!text) {
    return await bot.sendMessage(chatId, "Tu mensaje debe contener texto");
  }
  try {
    const agents = new Agents();
    const resp = await agents.clasifierAgent(text);
    const rafaResp = await agents.rafaAgent(text, resp);
    return await bot.sendMessage(chatId, rafaResp ? rafaResp : "Sin respuesta");
  } catch (error) {
    console.log("Fallo");
    return await bot.sendMessage(chatId, "La api se quedo sin request xd");
  }
});
