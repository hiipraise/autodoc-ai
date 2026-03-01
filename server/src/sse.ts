import type { Response } from 'express';

interface SSEClient {
  id: string;
  res: Response;
}

class SSEManager {
  private clients: Map<string, SSEClient> = new Map();

  addClient(id: string, res: Response): void {
    res.setHeader('Content-Type',  'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection',    'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    // Keep-alive ping every 20s
    const ping = setInterval(() => {
      if (!res.writableEnded) res.write(': ping\n\n');
    }, 20_000);

    res.on('close', () => {
      clearInterval(ping);
      this.clients.delete(id);
    });

    this.clients.set(id, { id, res });
    this.sendToClient(id, { type: 'connected', timestamp: new Date().toLocaleTimeString() });
  }

  sendToClient(id: string, data: object): void {
    const client = this.clients.get(id);
    if (client && !client.res.writableEnded) {
      client.res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  }

  broadcast(data: object): void {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    for (const client of this.clients.values()) {
      if (!client.res.writableEnded) client.res.write(payload);
    }
  }

  clientCount(): number {
    return this.clients.size;
  }
}

export const sseManager = new SSEManager();