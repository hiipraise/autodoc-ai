import { Sparkles } from 'lucide-react';

export function FeatureList({ features }: { features: string[] }) {
  if (!features.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-2 text-slate-600">
        <Sparkles size={18} className="opacity-40" />
        <span className="text-sm">No features extracted yet</span>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-slate-300 group">
          <span className="shrink-0 mt-0.5 w-5 h-5 rounded bg-[#FE7F2D]/10 border border-[#FE7F2D]/20 text-[#FE7F2D] text-[10px] font-bold font-mono flex items-center justify-center">
            {i + 1}
          </span>
          <span className="group-hover:text-white transition-colors leading-relaxed">{feature}</span>
        </li>
      ))}
    </ul>
  );
}