import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import type { ScanResult, ScanStatus } from '../lib/types';

export function useScanner() {
  const [result, setResult]   = useState<ScanResult | null>(null);
  const [status, setStatus]   = useState<ScanStatus>('idle');
  const [error, setError]     = useState<string | null>(null);

  const scan = useCallback(async (dir: string) => {
    setStatus('scanning');
    setError(null);

    const res = await api.scan.start(dir);
    if (res.success && res.data) {
      setResult(res.data);
      setStatus('done');
    } else {
      setError(res.error ?? 'Scan failed');
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setStatus('idle');
    setError(null);
  }, []);

  return { result, status, error, scan, reset };
}