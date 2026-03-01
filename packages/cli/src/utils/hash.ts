import crypto from 'crypto';
import fs from 'fs-extra';

export class FileHashCache {
  private cache = new Map<string, string>();

  async hasChanged(filePath: string): Promise<boolean> {
    const current = await this.computeHash(filePath);
    if (!current) return false;
    const previous = this.cache.get(filePath);
    const changed = previous !== current;
    if (changed) this.cache.set(filePath, current);
    return changed;
  }

  async computeHash(filePath: string): Promise<string | null> {
    try {
      const content = await fs.readFile(filePath);
      return crypto.createHash('sha256').update(content).digest('hex');
    } catch {
      return null;
    }
  }

  set(filePath: string, hash: string): void {
    this.cache.set(filePath, hash);
  }

  delete(filePath: string): void {
    this.cache.delete(filePath);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}