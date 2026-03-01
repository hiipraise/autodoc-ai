import { Settings } from 'lucide-react';
import { SectionHeading, SubHeading, Prose } from '../SectionHeading';
import { CodeBlock } from '../CodeBlock';

const FIELDS = [
  { key: 'output',              desc: 'Where README.md is written, relative to the scanned project root.' },
  { key: 'ai.provider',         desc: '"groq" or "ollama". Groq requires GROQ_API_KEY in .env.' },
  { key: 'ai.model',            desc: 'Model string passed to the provider. See AI Providers for options.' },
  { key: 'ai.fallback',         desc: 'Provider to try on failure: "ollama" or "none".' },
  { key: 'scan.maxDepth',       desc: 'Maximum directory depth to recurse into. Default: 8.' },
  { key: 'scan.maxFileSizeKB',  desc: 'Files larger than this skip content loading for AI. Default: 100.' },
  { key: 'scan.extraIgnore',    desc: 'Additional glob patterns ignored on top of .gitignore rules.' },
  { key: 'readme.sections',     desc: 'Ordered list of sections. Remove any name to exclude that section.' },
  { key: 'readme.treeMaxDepth', desc: 'How deep the ASCII file tree renders in the output. Default: 4.' },
  { key: 'watch.debounceMs',    desc: 'Milliseconds to wait after the last change before rebuilding. Default: 1500.' },
];

const CONFIG_JSON = `{
  "version": "1",
  "output": "./README.md",

  "ai": {
    "provider": "groq",
    "model": "llama3-70b-8192",
    "fallback": "ollama",
    "ollamaModel": "codellama:7b"
  },

  "scan": {
    "maxDepth": 8,
    "maxFileSizeKB": 100,
    "includeHidden": false,
    "extraIgnore": ["*.test.ts", "coverage/", "*.log"]
  },

  "readme": {
    "sections": [
      "header", "features", "filetree",
      "installation", "usage", "tech-stack", "license"
    ],
    "showBadges": true,
    "treeMaxDepth": 4,
    "license": "MIT"
  },

  "watch": {
    "debounceMs": 1500,
    "triggerOnAdd": true,
    "triggerOnDelete": true,
    "triggerOnChange": true
  }
}`;

export function ConfigSection() {
  return (
    <div>
      <SectionHeading
        icon={Settings}
        label="Configuration"
        title="Configuration"
        subtitle="Configure AutoDoc via .autodoc.json in your project root, or run npx autodoc init for a guided setup."
      />

      <CodeBlock code={CONFIG_JSON} lang="json" />

      <SubHeading>Field reference</SubHeading>
      <div className="border border-white/6 rounded-lg overflow-hidden">
        {FIELDS.map((f, i) => (
          <div
            key={f.key}
            className={`flex gap-4 px-4 py-3 items-baseline ${i < FIELDS.length - 1 ? 'border-b border-white/4' : ''}`}
          >
            <code className="text-[11.5px] font-mono text-[#FE7F2D] shrink-0 w-44">{f.key}</code>
            <span className="text-[12px] text-slate-500 leading-relaxed">{f.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}