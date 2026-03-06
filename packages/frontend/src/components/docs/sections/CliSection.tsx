// packages/frontend/src/components/docs/sections/CliSection.tsx
import { Terminal } from 'lucide-react';
import { SectionHeading, SubHeading } from '../SectionHeading';
import { CodeBlock } from '../CodeBlock';

interface Flag { flag: string; desc: string }
interface Cmd  { cmd: string; desc: string; flags?: Flag[] }

const COMMANDS: Cmd[] = [
  {
    cmd:  'autodoc init',
    desc: 'Interactive wizard — creates .autodoc.json with your preferences.',
  },
  {
    cmd:  'autodoc generate [dir]',
    desc: 'Scan a directory and write README.md once.',
    flags: [
      { flag: '-o, --output <path>', desc: 'Where to write the README (default: ./README.md)' },
      { flag: '--no-ai',             desc: 'Skip AI, use heuristics only' },
      { flag: '--dry-run',           desc: 'Preview output without writing to disk' },
      { flag: '--model <model>',     desc: 'Override AI model for this run' },
    ],
  },
  {
    cmd:  'autodoc watch [dir]',
    desc: 'Watch for file changes and regenerate README automatically.',
    flags: [
      { flag: '-o, --output <path>',  desc: 'README output path' },
      { flag: '--debounce <ms>',      desc: 'Wait time after last change (default: 1500)' },
    ],
  },
];

export function CliSection() {
  return (
    <div>
      <SectionHeading
        icon={Terminal}
        label="CLI Reference"
        title="Command Line"
        subtitle="All commands are available via npx autodoc from any directory."
      />

      <div className="space-y-3 mb-6">
        {COMMANDS.map(({ cmd, desc, flags }) => (
          <div
            key={cmd}
            className="border border-white/6 rounded-lg overflow-hidden hover:border-[#FE7F2D]/15 transition-colors"
          >
            <div className="flex items-baseline gap-4 px-4 py-3 bg-[#0f1f28]">
              <code className="text-[13px] font-mono text-[#FE7F2D] font-medium shrink-0">{cmd}</code>
              <span className="text-[12.5px] text-slate-500">{desc}</span>
            </div>
            {flags && flags.length > 0 && (
              <div className="px-4 py-2.5 border-t border-white/5 space-y-1.5">
                {flags.map(f => (
                  <div key={f.flag} className="flex gap-4 items-baseline">
                    <code className="text-[11.5px] font-mono text-blue-400 shrink-0 w-44">{f.flag}</code>
                    <span className="text-[11.5px] text-slate-600">{f.desc}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <SubHeading>Examples</SubHeading>
      <CodeBlock code={`# Current directory\nnpx autodoc generate .\n\n# Specific project\nnpx autodoc generate /path/to/my-project\n\n# Custom output path\nnpx autodoc generate . --output ./docs/README.md\n\n# Preview only\nnpx autodoc generate . --dry-run\n\n# Skip AI\nnpx autodoc generate . --no-ai\n\n# All commands\nnpx autodoc --help`} />
    </div>
  );
}