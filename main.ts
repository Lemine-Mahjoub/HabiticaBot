import "dotenv/config";
import { CheckEnvToken, CreateClient } from "./lib";

const TOKEN = process.env.DISCORD_TOKEN;

CheckEnvToken(TOKEN);

const client = CreateClient();

client.once("ready", () => {
  console.log(`✅ Connected as ${client.user?.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === "!ping") {
    await message.reply("🏓 Pong !");
  }
});

client.login(TOKEN);
