import { aiService } from "./openai-ai.service.js";

async function run() {
  const text = "Este é um teste curto. Não é ofensivo.";
  console.log("Running moderation test...");
  const mod = await aiService.moderate(text);
  console.log("Moderation result:", mod);

  console.log("Requesting tag suggestions...");
  const tags = await aiService.suggestTags(text, 5);
  console.log("Tags:", tags);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
