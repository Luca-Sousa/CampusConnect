const GROQ_API_URL = "https://api.groq.com/openai/v1";

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GroqChoice {
  message?: { content?: string };
}

export interface GroqResponse {
  choices?: GroqChoice[];
}

export interface GroqChatOptions {
  model: string;
  messages: GroqMessage[];
  maxTokens?: number;
  temperature?: number;
}

export class GroqClient {
  constructor(private readonly apiKey: string) {}

  async chat(options: GroqChatOptions): Promise<string> {
    const res = await fetch(`${GROQ_API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: options.model,
        messages: options.messages,
        max_tokens: options.maxTokens ?? 256,
        temperature: options.temperature ?? 0.1,
      }),
    });

    if (!res.ok) {
      throw new Error(`Groq API error: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as GroqResponse;
    return data.choices?.[0]?.message?.content ?? "";
  }
}
