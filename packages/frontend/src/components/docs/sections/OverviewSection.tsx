import { BookOpen, FolderSearch, Cpu, Eye, Package, Monitor, Radio } from 'lucide-react';
import { SectionHeading, Prose } from '../SectionHeading';

const FEATURES = [
  { icon: FolderSearch, title: 'Smart Scanning',   desc: 'Recursively scans your project while honoring .gitignore rules at every directory level.' },
  { icon: Cpu,          title: 'AI Analysis',       desc: 'Groq (free tier) or local Ollama pull real features and descriptions from your actual code.' },
  { icon: Eye,          title: 'Watch Mode',        desc: 'File changes are debounced via Chokidar and trigger automatic README rebuilds.' },
  { icon: Package,      title: 'Auto Detection',    desc: 'Detects npm, yarn, pnpm, bun, pip, poetry, cargo, and go mod — plus frameworks and licenses.' },
  { icon: Monitor,      title: 'Web Dashboard',     desc: 'Live preview, file tree, diff viewer and watch log — all in a React + Vite interface.' },
  { icon: Radio,        title: 'Live Updates',      desc: 'Server-Sent Events broadcast README changes to all connected dashboard clients instantly.' },
];

export function OverviewSection() {
  return (
    <div>
      <SectionHeading
        icon={BookOpen}
        label="Overview"
        title="AutoDoc.ai"
        subtitle="Scan any project, respect your .gitignore, and generate a full README.md automatically — powered by free AI."
      />
      <Prose>
        Drop it into any codebase. AutoDoc reads your files, detects your stack, calls the AI, and
        writes a structured <code>README.md</code> with an ASCII file tree, feature list,
        install steps, and license section. Watch mode keeps it updated every time you save.
      </Prose>

      <div className="grid grid-cols-2 gap-2.5 mt-5">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex gap-3 bg-[#0f1f28] border border-white/5 rounded-lg p-3.5 hover:border-[#FE7F2D]/15 transition-colors"
          >
            <Icon size={15} className="text-[#FE7F2D] shrink-0 mt-0.5" />
            <div>
              <p className="text-[12px] font-semibold text-white mb-0.5">{title}</p>
              <p className="text-[11.5px] text-slate-500 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}