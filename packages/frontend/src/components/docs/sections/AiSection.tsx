import { Cpu, ChevronRight, Zap } from 'lucide-react';
import { SectionHeading, SubHeading, Prose } from '../SectionHeading';

const PROVIDERS = [
  {
    icon: Zap,
    name: 'Groq',
    badge: 'Free — 6,000 req/day',
    recommended: true,
    desc: 'Cloud inference via llama3-70b-8192. Fastest option. Free account at console.groq.com — no credit card.',
    steps: [
      'Create a free account at console.groq.com',
      'Go to API Keys and create a new key',
      'Add GROQ_API_KEY=gsk_... to your .env file',
    ],
  },
  {
    icon: Cpu,
    name: 'Ollama',
    badge: 'Free — runs locally',
    recommended: false,
    desc: 'Local inference on your own hardware. No API key, no rate limits, fully offline and private.',
    steps: [
      'Install Ollama from ollama.ai',
      'Pull a model: ollama pull codellama:7b',
      'Set provider to ollama in .autodoc.json',
    ],
  },
];

const MODELS = [
  { provider: 'Groq',   name: 'llama3-70b-8192',    speed: 'Fast',   quality: 'High'   },
  { provider: 'Groq',   name: 'llama3-8b-8192',     speed: 'Faster', quality: 'Good'   },
  { provider: 'Groq',   name: 'mixtral-8x7b-32768', speed: 'Medium', quality: 'High'   },
  { provider: 'Ollama', name: 'codellama:7b',        speed: 'Local',  quality: 'Good'   },
  { provider: 'Ollama', name: 'codellama:13b',       speed: 'Local',  quality: 'Better' },
  { provider: 'Ollama', name: 'deepseek-coder:6.7b', speed: 'Local',  quality: 'Good'   },
];

const FALLBACK = ['Groq (cloud)', 'Ollama (local)', 'Heuristics (no AI)'];

export function AiSection() {
  return (
    <div>
      <SectionHeading
        icon={Cpu}
        label="AI Providers"
        title="AI Providers"
        subtitle="Two free options. Groq is recommended for speed; Ollama for privacy and offline use."
      />

      <div className="grid grid-cols-2 gap-3 mb-6">
        {PROVIDERS.map(({ icon: Icon, name, badge, recommended, desc, steps }) => (
          <div
            key={name}
            className={`relative border rounded-lg p-4 ${
              recommended
                ? 'border-[#FE7F2D]/30 bg-[#FE7F2D]/3'
                : 'border-white/6 bg-[#0f1f28]'
            }`}
          >
            {recommended && (
              <div className="absolute -top-2.5 left-3 bg-[#FE7F2D] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                Recommended
              </div>
            )}
            <div className="flex items-center gap-2 mb-3 mt-1">
              <Icon size={15} className="text-[#FE7F2D]" />
              <span className="text-[13px] font-semibold text-white">{name}</span>
              <span className="text-[10px] text-green-400 bg-green-400/10 border border-green-400/15 px-2 py-0.5 rounded-full ml-auto">
                {badge}
              </span>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-3">{desc}</p>
            <ol className="space-y-1.5">
              {steps.map((s, i) => (
                <li key={i} className="flex gap-2 items-start text-[12px] text-slate-500">
                  <span className="w-4 h-4 rounded-full bg-[#FE7F2D]/10 border border-[#FE7F2D]/20 text-[#FE7F2D] font-bold font-mono text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <SubHeading>Fallback chain</SubHeading>
      <Prose>
        If the primary provider fails, AutoDoc falls back automatically without crashing.
      </Prose>
      <div className="flex items-center gap-2 flex-wrap mb-6">
        {FALLBACK.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-[#0f1f28] border border-white/6 rounded-lg px-3 py-2">
              <span className="w-4 h-4 rounded-full bg-[#FE7F2D]/10 text-[#FE7F2D] font-mono text-[9px] font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-[12.5px] text-slate-300">{step}</span>
            </div>
            {i < FALLBACK.length - 1 && (
              <ChevronRight size={13} className="text-slate-700" />
            )}
          </div>
        ))}
      </div>

      <SubHeading>Available models</SubHeading>
      <div className="border border-white/6 rounded-lg overflow-hidden">
        <div className="grid grid-cols-4 px-4 py-2 bg-[#FE7F2D]/5 border-b border-white/5">
          {['Provider', 'Model', 'Speed', 'Quality'].map(h => (
            <span key={h} className="text-[10px] uppercase tracking-widest font-semibold text-slate-600">{h}</span>
          ))}
        </div>
        {MODELS.map((m, i) => (
          <div key={m.name} className={`grid grid-cols-4 items-center px-4 py-2.5 text-[12px] ${i < MODELS.length - 1 ? 'border-b border-white/4' : ''}`}>
            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded w-fit ${m.provider === 'Groq' ? 'text-[#FE7F2D] bg-[#FE7F2D]/10' : 'text-blue-400 bg-blue-400/10'}`}>
              {m.provider}
            </span>
            <code className="font-mono text-green-400 text-[11.5px]">{m.name}</code>
            <span className="text-slate-500">{m.speed}</span>
            <span className="text-slate-500">{m.quality}</span>
          </div>
        ))}
      </div>
    </div>
  );
}