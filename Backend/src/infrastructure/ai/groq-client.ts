import Groq from "groq-sdk";

export interface GroqChatOptions {
  model: string;
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  maxTokens?: number;
  temperature?: number;
}

export class GroqClient {
  private client: Groq;

  constructor(apiKey: string) {
    this.client = new Groq({ apiKey });
  }

  async chat(options: GroqChatOptions): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: options.model,
      messages: options.messages,
      max_tokens: options.maxTokens ?? 256,
      temperature: options.temperature ?? 0.1,
    });

    return response.choices[0]?.message?.content ?? "";
  }
}
