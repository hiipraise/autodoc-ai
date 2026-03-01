import type { ApiResponse, ScanResult, AutoDocConfig } from './types';

const BASE = '/api';

async function request<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    });
    const json = await res.json();
    return json as ApiResponse<T>;
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export const api = {
  scan: {
    start: (dir: string) =>
      request<ScanResult>('/scan', { method: 'POST', body: JSON.stringify({ dir }) }),
    latest: () =>
      request<ScanResult>('/scan/latest'),
  },
  readme: {
    get: () =>
      request<{ content: string; generatedAt: string }>('/readme'),
    regenerate: (dir: string) =>
      request<{ content: string }>('/readme/regenerate', { method: 'POST', body: JSON.stringify({ dir }) }),
  },
  config: {
    get: () =>
      request<AutoDocConfig>('/config'),
    update: (cfg: Partial<AutoDocConfig>) =>
      request<AutoDocConfig>('/config', { method: 'PUT', body: JSON.stringify(cfg) }),
  },
};