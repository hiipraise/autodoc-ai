import { useEffect, useState } from 'react';

const ASCII = `     ___       __        ____
    /   | __  __/ /_____/ __ \\____  _____   ____ _(_)
   / /| |/ / / / __/ __ / / / / __ \\/ ___/  / __ \`/ /
  / ___ / /_/ / /_/ /_/ /_/ / /_/ / /__   / /_/ / /
 /_/  |_\\__,_/\\__/\\____/_____/\\____/\\___/   \\__,_/_/`;

export function Logo({ animate = true }: { animate?: boolean }) {
  const [glowing, setGlowing] = useState(false);

  useEffect(() => {
    if (!animate) return;
    const id = setInterval(() => setGlowing(g => !g), 2000);
    return () => clearInterval(id);
  }, [animate]);

  return (
    <div className="select-none">
      <pre
        className="font-mono text-[10px] leading-tight transition-all duration-1000"
        style={{
          color: '#FE7F2D',
          textShadow: glowing
            ? '0 0 20px rgba(254,127,45,0.6), 0 0 40px rgba(254,127,45,0.3)'
            : '0 0 10px rgba(254,127,45,0.2)',
        }}
      >
        {ASCII}
      </pre>
      <p className="text-[#94a3b8] text-xs text-center tracking-[4px] uppercase mt-1">
        Your codebase &middot; Documented &middot; Automatically
      </p>
    </div>
  );
}