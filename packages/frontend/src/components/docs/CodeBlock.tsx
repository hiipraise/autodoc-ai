import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  lang?: string;
}

export function CodeBlock({ code, lang = 'bash' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-[#FE7F2D]/10 overflow-hidden my-3">
      <div className="flex items-center justify-between px-4 py-2 bg-[#FE7F2D]/5 border-b border-[#FE7F2D]/8">
        <span className="text-[10px] tracking-widest uppercase font-semibold text-[#FE7F2D]/50">
          {lang}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-[#FE7F2D] transition-colors"
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="px-4 py-4 bg-[#0c1a22] text-[#7ec897] overflow-x-auto leading-relaxed whitespace-pre text-[12.5px] font-mono">
        {code}
      </pre>
    </div>
  );
}