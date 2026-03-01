import { Plus, Minus, GitCompare } from 'lucide-react';

interface DiffViewerProps {
  before: string | null;
  after:  string | null;
}

type LineType = 'add' | 'remove' | 'same';
interface DiffLine { type: LineType; line: string }

function computeDiff(before: string, after: string): DiffLine[] {
  const oldLines = before.split('\n');
  const newLines = after.split('\n');
  const result: DiffLine[] = [];
  const maxLen = Math.max(oldLines.length, newLines.length);
  for (let i = 0; i < maxLen; i++) {
    const o = oldLines[i];
    const n = newLines[i];
    if (o === n)            result.push({ type: 'same',   line: n ?? '' });
    else if (o === undefined) result.push({ type: 'add',  line: n });
    else if (n === undefined) result.push({ type: 'remove', line: o });
    else {
      result.push({ type: 'remove', line: o });
      result.push({ type: 'add',    line: n });
    }
  }
  return result;
}

export function DiffViewer({ before, after }: DiffViewerProps) {
  if (!before || !after) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-slate-600 text-sm gap-2">
        <GitCompare size={20} className="opacity-40" />
        <span>No diff available yet</span>
      </div>
    );
  }

  const diff    = computeDiff(before, after);
  const added   = diff.filter(d => d.type === 'add').length;
  const removed = diff.filter(d => d.type === 'remove').length;

  return (
    <div>
      <div className="flex gap-4 mb-3 text-xs font-mono">
        <span className="flex items-center gap-1 text-green-400">
          <Plus size={11} /> {added} added
        </span>
        <span className="flex items-center gap-1 text-red-400">
          <Minus size={11} /> {removed} removed
        </span>
      </div>
      <div className="overflow-y-auto max-h-80 bg-[#0f1f28] rounded-lg border border-[#FE7F2D]/10 p-3 font-mono text-[11.5px]">
        {diff.map((d, i) => (
          <div
            key={i}
            className={`flex gap-2 leading-5 ${
              d.type === 'add'    ? 'text-green-400 bg-green-400/5' :
              d.type === 'remove' ? 'text-red-400 bg-red-400/5'   :
                                    'text-slate-600'
            }`}
          >
            <span className="w-3 shrink-0 select-none opacity-70">
              {d.type === 'add' ? '+' : d.type === 'remove' ? '-' : ' '}
            </span>
            <span className="whitespace-pre-wrap break-all">{d.line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}