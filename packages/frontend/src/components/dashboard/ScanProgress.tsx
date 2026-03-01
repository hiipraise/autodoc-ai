import { Spinner } from '../ui/Spinner';

interface ScanProgressProps {
  status: 'idle' | 'scanning' | 'analyzing' | 'building' | 'done' | 'error';
  fileCount?: number;
  currentFile?: string;
  error?: string;
}

const STEPS = [
  { key: 'scanning',  label: 'Scanning files',       icon: '🔍' },
  { key: 'analyzing', label: 'AI analysis',           icon: '🤖' },
  { key: 'building',  label: 'Building README',       icon: '📝' },
  { key: 'done',      label: 'Complete',              icon: '✅' },
];

export function ScanProgress({ status, fileCount, currentFile, error }: ScanProgressProps) {
  if (status === 'idle') return null;

  const stepIndex = STEPS.findIndex(s => s.key === status);
  const isError = status === 'error';

  return (
    <div className="bg-[#0f1f28] border border-[#FE7F2D]/15 rounded-xl p-4">
      {isError ? (
        <div className="flex items-center gap-3 text-red-400">
          <span className="text-xl">❌</span>
          <div>
            <p className="font-semibold text-sm">Scan failed</p>
            <p className="text-xs opacity-70">{error}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-4">
            {STEPS.map((step, i) => {
              const done    = i < stepIndex || status === 'done';
              const current = step.key === status;
              return (
                <div key={step.key} className="flex items-center gap-2 flex-1">
                  <div className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    done    ? 'text-green-400' :
                    current ? 'text-[#FE7F2D]' :
                              'text-slate-600'
                  }`}>
                    {current ? <Spinner size="sm" /> : <span>{done ? '✓' : step.icon}</span>}
                    <span className="hidden sm:inline">{step.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-px ${done ? 'bg-green-400/40' : 'bg-slate-700'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Status text */}
          <div className="text-xs text-slate-400 flex justify-between">
            <span className="truncate max-w-xs">{currentFile ?? ''}</span>
            {fileCount !== undefined && (
              <span className="text-[#FE7F2D] shrink-0">{fileCount} files</span>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FE7F2D] to-[#e56510] rounded-full transition-all duration-500"
              style={{ width: status === 'done' ? '100%' : `${Math.max(15, (stepIndex / (STEPS.length - 1)) * 100)}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}