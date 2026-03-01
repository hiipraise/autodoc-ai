import { useEffect, useState } from "react";

interface WatchEvent {
  type: "readme-updated" | "file-changed" | "scan-started" | "error";
  timestamp: string;
  file?: string;
  message?: string;
}

const EVENT_CONFIG = {
  "readme-updated": { icon: "✅", color: "text-[#FE7F2D]" },
  "file-changed": { icon: "📝", color: "text-slate-300" },
  "scan-started": { icon: "🔄", color: "text-blue-400" },
  error: { icon: "❌", color: "text-red-400" },
};

export function WatchStatus() {
  const [events, setEvents] = useState<WatchEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const evtSource = new EventSource("/api/watch/stream");
    evtSource.onopen = () => setIsConnected(true);
    evtSource.onmessage = (e) => {
      try {
        const event: WatchEvent = JSON.parse(e.data);
        setEvents((prev) => [event, ...prev.slice(0, 49)]);
        setPulse(true);
        setTimeout(() => setPulse(false), 600);
      } catch {
        /* ignore malformed */
      }
    };
    evtSource.onerror = () => setIsConnected(false);
    return () => evtSource.close();
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Status indicator */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            isConnected
              ? pulse
                ? "bg-[#FE7F2D] scale-150"
                : "bg-green-400 animate-pulse"
              : "bg-gray-600"
          }`}
        />
        <span className="text-sm font-semibold text-white">
          {isConnected ? "Watch Mode Active" : "Not Connected"}
        </span>
        <span className="ml-auto text-xs text-slate-500">
          {events.length} events
        </span>
      </div>

      {/* Event log */}
      <div className="flex-1 overflow-y-auto bg-[#0f1f28] rounded-lg border border-[#FE7F2D]/10 p-3 font-mono text-xs space-y-1.5">
        {events.length === 0 ? (
          <p className="text-slate-600 text-center py-8">
            Waiting for file changes...
          </p>
        ) : (
          events.map((event, i) => {
            const cfg = EVENT_CONFIG[event.type] ?? {
              icon: "•",
              color: "text-slate-400",
            };
            return (
              <div
                key={i}
                className={`flex gap-2 ${i === 0 ? "opacity-100" : "opacity-50"}`}
              >
                <span className="text-slate-600 shrink-0">
                  {event.timestamp}
                </span>
                <span className={cfg.color}>{cfg.icon}</span>
                <span className="text-slate-300 truncate">
                  {event.file ?? event.message ?? event.type}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
