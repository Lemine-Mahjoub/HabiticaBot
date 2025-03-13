import "dotenv/config";

export function CheckEnvToken(TOKEN: string | undefined) {
  if (!TOKEN) {
    console.error(
      "🚨 Error : DISCORD_TOKEN not found in .env, be sure to have .env file"
    );
    process.exit(1);
  }
}
