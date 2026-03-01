import { useEffect, useRef, useState } from 'react';
import type { WatchEvent } from '../lib/types';

export function useFileWatcher() {
  const [events, setEvents]       = useState<WatchEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const sourceRef                 = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource('/api/watch/stream');
    sourceRef.current = es;

    es.onopen    = ()  => setConnected(true);
    es.onerror   = ()  => setConnected(false);
    es.onmessage = (e) => {
      try {
        const event: WatchEvent = JSON.parse(e.data);
        setEvents(prev => [event, ...prev.slice(0, 99)]);
      } catch { /* skip */ }
    };

    return () => { es.close(); sourceRef.current = null; };
  }, []);

  const clearEvents = () => setEvents([]);

  return { events, connected, clearEvents };
}