interface StatusBarProps {
  connected: boolean;
  lastUpdate?: string;
  fileCount?: number;
}

export function StatusBar({ connected, lastUpdate, fileCount }: StatusBarProps) {
  return (
    <div className="fixed bottom-0 left-14 right-0 h-6 bg-[#233D4D] border-t border-[#FE7F2D]/10 flex items-center px-4 gap-4 text-[10px] text-slate-500 z-40">
      <span className={`flex items-center gap-1 ${connected ? 'text-green-400' : 'text-slate-600'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`} />
        {connected ? 'Watch active' : 'Disconnected'}
      </span>
      {fileCount !== undefined && <span>{fileCount} files indexed</span>}
      {lastUpdate && <span className="ml-auto">Last update: {lastUpdate}</span>}
      <span className="ml-auto text-[#FE7F2D]/40">AutoDoc.ai v1.0.0</span>
    </div>
  );
}