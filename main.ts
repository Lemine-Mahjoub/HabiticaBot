import "dotenv/config";
import { CheckEnvToken, CreateClient } from "./lib";
import axios from "axios";

const TOKEN = process.env.DISCORD_TOKEN;
const BACKEND_URL = "http://localhost:2005";

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

  if (message.content === "!help") {
    await message.reply("HELP COMMAND");
  }

  if (message.content === "!id") {
    await message.reply(message.author.id);
  }

  if (message.content.startsWith("!config")) {
    const args = message.content.split(" ");
    if (args.length !== 3) {
      return message.reply("Usage: !config <HabiticaUserID> <HabiticaAPIKey>");
    }

    const habiticaUserId = args[1];
    const habiticaApiKey = args[2];
    const discordId = message.author.id;

    try {
      await axios.post(`${BACKEND_URL}/data`, {
        [discordId]: {
          habiticaUserId,
          habiticaApiKey,
        },
      });
      message.reply("✅ Configuration enregistrée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'envoi des données:", error);
      message.reply("❌ Une erreur s'est produite lors de l'enregistrement.");
    }
  }

  if (message.content.startsWith("!tasks")) {
    const userId = message.author.id;

    try {
      const response = await axios.get(`${BACKEND_URL}/data`);
      const userData = response.data.find((entry) => entry[userId]);

      if (!userData) {
        return message.reply(
          "❌ Aucune configuration trouvée. Utilisez `!config` d'abord."
        );
      }

      const { habiticaUserId, habiticaApiKey } = userData[userId];

      const habiticaResponse = await axios.get(
        "https://habitica.com/api/v3/tasks/user",
        {
          headers: {
            "x-api-user": habiticaUserId,
            "x-api-key": habiticaApiKey,
          },
        }
      );

      const tasks = habiticaResponse.data.data;
      if (!tasks.length) {
        return message.reply("📭 Aucune tâche trouvée.");
      }

      const taskList = tasks
        .map((task) => `- **${task.text}** (${task.type})`)
        .join("\n");

      message.reply(`📋 **Voici tes tâches Habitica :**\n${taskList}`);
    } catch (error) {
      console.error("Erreur lors de la récupération des tâches:", error);
      message.reply(
        "❌ Impossible de récupérer les tâches. Vérifiez votre configuration."
      );
    }
  }
});

client.login(TOKEN);
