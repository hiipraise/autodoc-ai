import type { AutoDocConfig } from '../utils/config';
import { analyzeWithGroq } from './groq';
import { analyzeWithOllama } from './ollama';
import { logger } from '../utils/logger';

export async function routeAI(
  prompt: string,
  systemPrompt: string,
  config: AutoDocConfig
): Promise<string> {
  const { provider, model, fallback, ollamaModel } = config.ai;

  // Try primary provider
  if (provider === 'groq' && process.env.GROQ_API_KEY) {
    try {
      return await analyzeWithGroq(prompt, systemPrompt, model);
    } catch (err) {
      logger.warn(`Groq failed: ${(err as Error).message}. Trying fallback...`);
    }
  }

  if (provider === 'ollama') {
    try {
      return await analyzeWithOllama(prompt, systemPrompt, ollamaModel);
    } catch (err) {
      logger.warn(`Ollama failed: ${(err as Error).message}. Trying fallback...`);
    }
  }

  // Try fallback
  if (fallback === 'ollama') {
    try {
      return await analyzeWithOllama(prompt, systemPrompt, ollamaModel);
    } catch {
      logger.warn('Ollama fallback unavailable. Running without AI analysis.');
    }
  }

  throw new Error('All AI providers failed or are unconfigured.');
}