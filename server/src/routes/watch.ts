import { Router } from 'express';
import { randomUUID } from 'crypto';
import { sseManager } from '../sse';

export const watchRouter = Router();

// SSE stream endpoint — frontend subscribes here
watchRouter.get('/stream', (req, res) => {
  const clientId = randomUUID();
  sseManager.addClient(clientId, res);
});

// CLI posts events to this endpoint when files change
watchRouter.post('/event', (req, res) => {
  const event = req.body;
  sseManager.broadcast({
    ...event,
    timestamp: new Date().toLocaleTimeString(),
  });
  res.json({ success: true, clients: sseManager.clientCount() });
});

watchRouter.get('/status', (_req, res) => {
  res.json({ success: true, data: { clients: sseManager.clientCount() } });
});