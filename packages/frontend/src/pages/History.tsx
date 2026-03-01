import { useEffect, useState } from 'react';
import { ScrollText, LayoutList, GitCompare, History as HistoryIcon } from 'lucide-react';
import { Card }       from '../components/ui/Card';
import { DiffViewer } from '../components/dashboard/DiffViewer';
import { formatRelativeTime } from '../lib/utils';

interface HistoryEntry {
  id:          string;
  content:     string;
  generatedAt: string;
  fileCount:   number;
}

export default function History() {
  const [entries,  setEntries]  = useState<HistoryEntry[]>([]);
  const [selected, setSelected] = useState<[HistoryEntry | null, HistoryEntry | null]>([null, null]);

  useEffect(() => {
    fetch('/api/readme/history')
      .then(r => r.json())
      .then(d => d.success && setEntries(d.data ?? []))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#182c38] text-white p-6">
      <div className="flex items-center gap-3 mb-6">
        <HistoryIcon size={18} className="text-[#FE7F2D]" />
        <h1 className="text-xl font-bold text-white">README History</h1>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-4">
          <Card title="Snapshots" icon={<LayoutList size={13} />}>
            {entries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-600 gap-2">
                <ScrollText size={20} className="opacity-30" />
                <p className="text-sm">No history yet</p>
              </div>
            ) : (
              <ul className="space-y-1.5">
                {entries.map(entry => (
                  <li
                    key={entry.id}
                    onClick={() => setSelected(([, b]) => [entry, b])}
                    className="flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer hover:bg-[#FE7F2D]/8 border border-transparent hover:border-[#FE7F2D]/15 transition-all"
                  >
                    <div>
                      <p className="text-xs font-mono text-[#FE7F2D]">{entry.id.slice(0, 8)}</p>
                      <p className="text-xs text-slate-500">{formatRelativeTime(entry.generatedAt)}</p>
                    </div>
                    <span className="text-xs text-slate-600">{entry.fileCount} files</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="col-span-12 md:col-span-8">
          <Card title="Diff Viewer" icon={<GitCompare size={13} />}>
            <DiffViewer
              before={selected[0]?.content ?? null}
              after={selected[1]?.content  ?? null}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}