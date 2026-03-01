import type { Request, Response, NextFunction } from 'express';

const PUMPKIN = '\x1b[38;2;254;127;45m';
const RESET   = '\x1b[0m';
const DIM     = '\x1b[2m';

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on('finish', () => {
    const ms     = Date.now() - start;
    const status = res.statusCode;
    const color  = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : '\x1b[32m';
    console.log(
      `${PUMPKIN}[AutoDoc]${RESET} ${DIM}${new Date().toLocaleTimeString()}${RESET} ` +
      `${color}${status}${RESET} ${req.method} ${req.path} ${DIM}${ms}ms${RESET}`
    );
  });
  next();
}