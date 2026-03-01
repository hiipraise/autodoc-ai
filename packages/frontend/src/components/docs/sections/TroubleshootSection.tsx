import { TriangleAlert } from 'lucide-react';
import { SectionHeading } from '../SectionHeading';
import { CodeBlock } from '../CodeBlock';
import { Callout } from '../Callout';

const ISSUES = [
  {
    problem: 'npm install fails with peer dependency errors',
    fix:     'Clear cache and retry with the legacy peer deps flag.',
    code:    `npm cache clean --force\nnpm install --legacy-peer-deps`,
  },
  {
    problem: 'Port 3000 or 4000 already in use',
    fix:     'Change the port in the relevant config files.',
    code:    `# Frontend: packages/frontend/vite.config.ts\nserver: { port: 3001 }\n\n# Server: server/src/index.ts\nconst PORT = process.env.SERVER_PORT ?? 4001`,
  },
  {
    problem: 'Scan returns "Directory not found"',
    fix:     'Use the absolute path. Relative paths can resolve incorrectly on Windows.',
    code:    `# Correct\nC:\\Users\\YourName\\Projects\\my-app\n\n# Avoid (can break on Windows)\n./my-app`,
  },
  {
    problem: 'AI features not working — no features extracted',
    fix:     'Check that GROQ_API_KEY is set in .env, or run with --no-ai to skip.',
    code:    `# Verify .env contains:\nGROQ_API_KEY=gsk_xxxxxxxxxxxx\n\n# Or skip AI entirely:\nnpx autodoc generate . --no-ai`,
  },
  {
    problem: 'Watch mode not detecting file changes on Linux',
    fix:     'Increase the inotify watch limit — the default is too low for large projects.',
    code:    `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf\nsudo sysctl -p`,
  },
  {
    problem: 'Cannot find module @autodoc-ai/cli/core/scanner',
    fix:     'The CLI package is not built. Replace server/src/routes/scan.ts with the fixed version from SETUP.md — it has an inline scanner with no cross-package imports.',
    code:    null,
  },
];

export function TroubleshootSection() {
  return (
    <div>
      <SectionHeading
        icon={TriangleAlert}
        label="Troubleshooting"
        title="Troubleshooting"
        subtitle="Common issues and their fixes."
      />

      <div className="space-y-3">
        {ISSUES.map(({ problem, fix, code }) => (
          <div
            key={problem}
            className="border border-white/6 rounded-lg overflow-hidden hover:border-[#FE7F2D]/10 transition-colors"
          >
            <div className="flex items-start gap-3 px-4 py-3 bg-[#0f1f28]">
              <TriangleAlert size={13} className="text-amber-400 shrink-0 mt-0.5" />
              <span className="text-[13px] font-semibold text-white">{problem}</span>
            </div>
            <div className="px-4 pt-2 pb-3 border-t border-white/5">
              <p className="text-[12.5px] text-slate-500 mb-2">{fix}</p>
              {code && <CodeBlock code={code} />}
            </div>
          </div>
        ))}
      </div>

      <Callout type="info">
        Still stuck? Check <strong>SETUP.md</strong> in the project root for a complete walkthrough including Windows-specific issues.
      </Callout>
    </div>
  );
}