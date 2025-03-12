import { Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

// Vérifie si le token est bien défini
const token = process.env.DISCORD_TOKEN;
if (!token) {
    console.error("🚨 Erreur : Aucun token trouvé dans le fichier .env !");
    process.exit(1);
}

// Création du client Discord
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// Événement : quand le bot est prêt
client.once('ready', () => {
    console.log(`✅ Connecté en tant que ${client.user?.tag}`);
});

// Événement : quand un message est envoyé
client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // Ignore les messages des bots
    if (message.content.toLowerCase() === '!ping') {
        await message.reply('🏓 Pong !');
    }
});

// Connexion au bot
client.login(token);
