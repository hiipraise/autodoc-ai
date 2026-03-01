import chokidar, { type FSWatcher } from 'chokidar';
import path from 'path';
import type { GitignoreFilter } from './gitignore';

export type WatchEventType = 'add' | 'change' | 'unlink';

export interface WatchEvent {
  type: WatchEventType;
  filePath: string;
  relativePath: string;
  timestamp: Date;
}

export interface WatcherOptions {
  debounceMs?: number;
  ignored?: string[];
}

export class FileWatcher {
  private watcher: FSWatcher | null = null;
  private listeners: Array<(event: WatchEvent) => void> = [];

  constructor(
    private readonly rootDir: string,
    private readonly filter: GitignoreFilter,
    private readonly outputFile: string,
    private readonly options: WatcherOptions = {}
  ) {}

  start(): void {
    if (this.watcher) return;

    this.watcher = chokidar.watch(this.rootDir, {
      ignored: (filePath: string) => {
        if (filePath.includes('node_modules')) return true;
        if (filePath.includes('/.git/')) return true;
        if (filePath.includes('/dist/')) return true;
        if (filePath.includes('/build/')) return true;
        if (filePath.includes('/coverage/')) return true;
        if (path.resolve(filePath) === path.resolve(this.outputFile)) return true;
        const rel = path.relative(this.rootDir, filePath);
        return !this.filter.accepts(rel);
      },
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100,
      },
    });

    const emit = (type: WatchEventType, filePath: string) => {
      const event: WatchEvent = {
        type,
        filePath,
        relativePath: path.relative(this.rootDir, filePath),
        timestamp: new Date(),
      };
      this.listeners.forEach(fn => fn(event));
    };

    this.watcher
      .on('add',    p => emit('add', p))
      .on('change', p => emit('change', p))
      .on('unlink', p => emit('unlink', p));
  }

  stop(): void {
    this.watcher?.close();
    this.watcher = null;
  }

  onChange(fn: (event: WatchEvent) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  isRunning(): boolean {
    return this.watcher !== null;
  }
}