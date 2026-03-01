import Groq from 'groq-sdk';

let client: Groq | null = null;

function getClient(): Groq {
  if (!client) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error('GROQ_API_KEY not set. Get a free key at https://console.groq.com');
    client = new Groq({ apiKey });
  }
  return client;
}

export async function analyzeWithGroq(
  prompt: string,
  systemPrompt: string,
  model = 'llama3-70b-8192'
): Promise<string> {
  const groq = getClient();

  const response = await groq.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
    max_tokens: 2048,
  });

  return response.choices[0]?.message?.content ?? '';
}