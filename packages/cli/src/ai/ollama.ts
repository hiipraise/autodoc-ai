interface OllamaRequest {
  model: string;
  prompt: string;
  system?: string;
  stream: boolean;
  options?: { temperature: number; num_predict: number };
}

interface OllamaResponse {
  response: string;
  done: boolean;
}

export async function analyzeWithOllama(
  prompt: string,
  systemPrompt: string,
  model = 'codellama:7b'
): Promise<string> {
  const baseUrl = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';

  const body: OllamaRequest = {
    model,
    prompt,
    system: systemPrompt,
    stream: false,
    options: { temperature: 0.3, num_predict: 2048 },
  };

  const res = await fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60_000),
  });

  if (!res.ok) {
    throw new Error(`Ollama error ${res.status}: ${await res.text()}`);
  }

  const data = (await res.json()) as OllamaResponse;
  return data.response ?? '';
}

export async function isOllamaAvailable(): Promise<boolean> {
  const baseUrl = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';
  try {
    const res = await fetch(`${baseUrl}/api/tags`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}