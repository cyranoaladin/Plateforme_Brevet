export interface LlmMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LlmResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
}

export interface ILlmProvider {
  generate(messages: LlmMessage[]): Promise<LlmResponse>;
}

export class OpenAIProvider implements ILlmProvider {
  async generate(messages: LlmMessage[]): Promise<LlmResponse> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.1 // Basse température pour limiter l'hallucination
      })
    });

    if (!response.ok) throw new Error(`OpenAI Error: ${response.statusText}`);
    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens
      }
    };
  }
}

export class MockProvider implements ILlmProvider {
  async generate(_messages: LlmMessage[]): Promise<LlmResponse> {
    void _messages; // Explicitly mark as used for linting compliance
    await new Promise(r => setTimeout(r, 800));
    return { text: "Ceci est une réponse de test. [Source:1]" };
  }
}

export function getLlmProvider(): ILlmProvider {
  const provider = process.env.ARIA_LLM_PROVIDER || "mock";
  if (provider === "openai") return new OpenAIProvider();
  return new MockProvider();
}
