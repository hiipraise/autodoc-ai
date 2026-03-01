import { useState, useCallback } from 'react';
import { api } from '../lib/api';

export function useReadme() {
  const [content, setContent]         = useState<string | null>(null);
  const [previousContent, setPrevious] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt]  = useState<string | null>(null);
  const [loading, setLoading]          = useState(false);
  const [error, setError]              = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await api.readme.get();
    if (res.success && res.data) {
      setPrevious(content);
      setContent(res.data.content);
      setGeneratedAt(res.data.generatedAt);
    } else {
      setError(res.error ?? 'Failed to load README');
    }
    setLoading(false);
  }, [content]);

  const regenerate = useCallback(async (dir: string) => {
    setLoading(true);
    setError(null);
    const res = await api.readme.regenerate(dir);
    if (res.success && res.data) {
      setPrevious(content);
      setContent(res.data.content);
      setGeneratedAt(new Date().toISOString());
    } else {
      setError(res.error ?? 'Failed to regenerate');
    }
    setLoading(false);
  }, [content]);

  return { content, previousContent, generatedAt, loading, error, load, regenerate };
}