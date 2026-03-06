import express, { Request, Response } from "express";
import { scanRouter } from "./routes/scan";
import { watchRouter } from "./routes/watch";
import { readmeRouter } from "./routes/readme";
import { configRouter } from "./routes/config";
import { loggerMiddleware } from "./middleware/logger";
import { corsMiddleware } from "./middleware/cors";

const app = express();
const PORT = process.env.SERVER_PORT ?? 4000;

app.use(corsMiddleware);
app.use(express.json({ limit: "10mb" }));
app.use(loggerMiddleware);

app.use("/api/scan", scanRouter);
app.use("/api/watch", watchRouter);
app.use("/api/readme", readmeRouter);
app.use("/api/config", configRouter);

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", version: "1.0.0", uptime: process.uptime() });
});


app.listen(PORT, () => {
  console.log(`🚀 AutoDoc.ai server running on port ${PORT}`);
});

export { app };
