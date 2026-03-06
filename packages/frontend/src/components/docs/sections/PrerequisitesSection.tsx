// packages/frontend/src/components/docs/sections/PrerequisitesSection.tsx
import { Package, ExternalLink } from 'lucide-react';
import { SectionHeading } from '../SectionHeading';
import { Callout } from '../Callout';

const REQS = [
  { tool: 'Node.js', version: '18+',  check: 'node -v',        link: 'https://nodejs.org' },
  { tool: 'npm',     version: '9+',   check: 'npm -v',         link: 'https://npmjs.com'  },
  { tool: 'Git',     version: 'any',  check: 'git --version',  link: 'https://git-scm.com'},
];

export function PrerequisitesSection() {
  return (
    <div>
      <SectionHeading
        icon={Package}
        label="Prerequisites"
        title="What You Need"
        subtitle="Verify these tools are installed before running the setup commands."
      />

      <div className="border border-white/6 rounded-lg overflow-hidden mb-4">
        <div className="grid grid-cols-4 px-4 py-2.5 bg-[#FE7F2D]/5 border-b border-white/5">
          {['Tool', 'Version', 'Check', 'Download'].map(h => (
            <span key={h} className="text-[10px] uppercase tracking-widest font-semibold text-slate-600">{h}</span>
          ))}
        </div>
        {REQS.map((r, i) => (
          <div
            key={r.tool}
            className={`grid grid-cols-4 items-center px-4 py-3 ${i < REQS.length - 1 ? 'border-b border-white/4' : ''}`}
          >
            <span className="text-[12.5px] font-semibold text-white">{r.tool}</span>
            <span className="text-[12px] font-mono text-[#FE7F2D]">{r.version}</span>
            <code className="text-[12px] font-mono text-green-400">{r.check}</code>
            <a
              href={r.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[12px] text-slate-500 hover:text-[#FE7F2D] transition-colors"
            >
              Download <ExternalLink size={9} />
            </a>
          </div>
        ))}
      </div>

      <Callout type="tip">
        On Windows, use <strong>PowerShell</strong> or <strong>Windows Terminal</strong>.
        The classic Command Prompt handles paths differently and can cause issues.
      </Callout>
    </div>
  );
}