import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { FileText, Copy } from 'lucide-react';

interface ReadmePreviewProps {
  content: string | null;
  isLoading?: boolean;
}

export function ReadmePreview({ content, isLoading }: ReadmePreviewProps) {
  const [mode, setMode] = useState<'preview' | 'raw'>('preview');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="w-8 h-8 border-2 border-[#FE7F2D] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Generating README...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-sm gap-2">
        <FileText className="w-10 h-10 text-slate-500" />
        <p>README will appear here after scanning</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <Button size="sm" variant={mode === 'preview' ? 'primary' : 'ghost'} onClick={() => setMode('preview')}>
          Preview
        </Button>
        <Button size="sm" variant={mode === 'raw' ? 'primary' : 'ghost'} onClick={() => setMode('raw')}>
          Raw
        </Button>
        <button
          className="ml-auto flex items-center gap-1 text-xs text-slate-400 hover:text-[#FE7F2D] transition-colors"
          onClick={() => navigator.clipboard.writeText(content)}
        >
          <Copy className="w-3.5 h-3.5" />
          Copy
        </button>
      </div>

      <div className="flex-1 overflow-y-auto rounded-lg bg-[#0f1f28] border border-[#FE7F2D]/10 p-4">
        {mode === 'preview' ? (
          <div className="prose prose-invert prose-sm max-w-none
            prose-headings:text-[#FE7F2D] prose-a:text-blue-400
            prose-code:text-green-300 prose-code:bg-[#233D4D]
            prose-pre:bg-[#182c38] prose-pre:border prose-pre:border-[#FE7F2D]/10">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        ) : (
          <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">{content}</pre>
        )}
      </div>
    </div>
  );
}