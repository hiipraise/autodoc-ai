import { Eye, CheckCircle2, XCircle, FolderOpen, ScanSearch, RefreshCw, Cpu, FileText, Radio } from 'lucide-react';
import { SectionHeading, SubHeading, Prose } from '../SectionHeading';
import { CodeBlock } from '../CodeBlock';
import { Callout } from '../Callout';

const PIPELINE = [
  { icon: FolderOpen, label: 'File saved'        },
  { icon: ScanSearch, label: 'Chokidar detects'  },
  { icon: RefreshCw,  label: 'Debounce (1.5s)'   },
  { icon: Cpu,        label: 'AI analysis'        },
  { icon: FileText,   label: 'README rebuilt'     },
  { icon: Radio,      label: 'Dashboard updated'  },
];

const TRIGGERS = [
  { label: 'File created',      on: true  },
  { label: 'File modified',     on: true  },
  { label: 'File deleted',      on: true  },
  { label: 'node_modules/',     on: false },
  { label: '.git/',             on: false },
  { label: 'dist/ and build/',  on: false },
  { label: 'The README itself', on: false },
  { label: '.gitignore matches',on: false },
];

export function WatchSection() {
  return (
    <div>
      <SectionHeading
        icon={Eye}
        label="Watch Mode"
        title="Live Watch Mode"
        subtitle="Monitor a directory and auto-rebuild README.md every time you save a file."
      />

      <CodeBlock code="npx autodoc watch /path/to/your-project" />

      <SubHeading>How it works</SubHeading>
      <div className="flex flex-wrap items-center gap-1.5 my-4 bg-[#0f1f28] border border-white/5 rounded-lg px-4 py-4">
        {PIPELINE.map(({ icon: Icon, label }, i) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-lg bg-[#FE7F2D]/8 border border-[#FE7F2D]/15 flex items-center justify-center">
                <Icon size={13} className="text-[#FE7F2D]" />
              </div>
              <span className="text-[10px] text-slate-600 text-center leading-tight max-w-[64px]">{label}</span>
            </div>
            {i < PIPELINE.length - 1 && (
              <span className="text-slate-700 text-sm mb-3">›</span>
            )}
          </div>
        ))}
      </div>

      <SubHeading>What triggers a rebuild</SubHeading>
      <div className="flex flex-wrap gap-2 mb-5">
        {TRIGGERS.map(({ label, on }) => (
          <div
            key={label}
            className={`flex items-center gap-1.5 text-[11.5px] px-2.5 py-1.5 rounded border ${
              on
                ? 'border-green-500/20 bg-green-500/5 text-green-400'
                : 'border-white/5 bg-white/2 text-slate-600'
            }`}
          >
            {on
              ? <CheckCircle2 size={11} />
              : <XCircle size={11} />
            }
            {label}
          </div>
        ))}
      </div>

      <Callout type="tip">
        Keep watch mode running in one terminal while the dashboard is open in the browser.
        The Watch Status panel shows a live log of every rebuild event.
      </Callout>

      <SubHeading>With the dashboard</SubHeading>
      <CodeBlock code={`# Terminal 1\nnpm run dev\n\n# Terminal 2\nnpx autodoc watch /path/to/your-project`} />
    </div>
  );
}