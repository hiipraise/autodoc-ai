import express from 'express';
import cors from 'cors';
import { scanRouter }   from './routes/scan';
import { watchRouter }  from './routes/watch';
import { readmeRouter } from './routes/readme';
import { configRouter } from './routes/config';
import { loggerMiddleware } from './middleware/logger';
import { corsMiddleware }   from './middleware/cors';

const app  = express();
const PORT = process.env.SERVER_PORT ?? 4000;

app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(loggerMiddleware);

app.use('/api/scan',   scanRouter);
app.use('/api/watch',  watchRouter);
app.use('/api/readme', readmeRouter);
app.use('/api/config', configRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(`\x1b[33m🚀 AutoDoc.ai server running on http://localhost:${PORT}\x1b[0m`);
});

export { app };