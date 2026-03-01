import { useRef, useState, useEffect } from 'react';
import {
  BookOpen, Package, Download, Zap,
  Terminal, Eye, Cpu, Settings, TriangleAlert,
} from 'lucide-react';

import { DocNav, type NavSection } from '../components/docs/DocNav';
import { OverviewSection      } from '../components/docs/sections/OverviewSection';
import { PrerequisitesSection } from '../components/docs/sections/PrerequisitesSection';
import { InstallationSection  } from '../components/docs/sections/InstallationSection';
import { QuickStartSection    } from '../components/docs/sections/QuickStartSection';
import { CliSection           } from '../components/docs/sections/CliSection';
import { WatchSection         } from '../components/docs/sections/WatchSection';
import { AiSection            } from '../components/docs/sections/AiSection';
import { ConfigSection        } from '../components/docs/sections/ConfigSection';
import { TroubleshootSection  } from '../components/docs/sections/TroubleshootSection';

const SECTIONS: NavSection[] = [
  { id: 'overview',      label: 'Overview',       icon: BookOpen,      group: 'start' },
  { id: 'prerequisites', label: 'Prerequisites',  icon: Package,       group: 'start' },
  { id: 'installation',  label: 'Installation',   icon: Download,      group: 'start' },
  { id: 'quickstart',    label: 'Quick Start',    icon: Zap,           group: 'start' },
  { id: 'cli',           label: 'CLI Reference',  icon: Terminal,      group: 'ref'   },
  { id: 'watch',         label: 'Watch Mode',     icon: Eye,           group: 'ref'   },
  { id: 'ai',            label: 'AI Providers',   icon: Cpu,           group: 'ref'   },
  { id: 'config',        label: 'Configuration',  icon: Settings,      group: 'ref'   },
  { id: 'troubleshoot',  label: 'Troubleshoot',   icon: TriangleAlert, group: 'ref'   },
];

const COMPONENTS: Record<string, React.ReactNode> = {
  overview:      <OverviewSection />,
  prerequisites: <PrerequisitesSection />,
  installation:  <InstallationSection />,
  quickstart:    <QuickStartSection />,
  cli:           <CliSection />,
  watch:         <WatchSection />,
  ai:            <AiSection />,
  config:        <ConfigSection />,
  troubleshoot:  <TroubleshootSection />,
};

export default function Docs() {
  const [active, setActive] = useState('overview');
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: '-10% 0px -55% 0px' },
    );
    Object.values(refs.current).forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    refs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(id);
  };

  return (
    <div className="min-h-screen bg-[#182c38] text-white">
      {/* Thin page header */}
      <div className="border-b border-[#FE7F2D]/10 px-8 py-3.5 flex items-center gap-2.5">
        <BookOpen size={14} className="text-[#FE7F2D]" />
        <span className="text-[13px] font-semibold text-white tracking-tight">Documentation</span>
        <span className="ml-auto text-[11px] font-mono text-[#FE7F2D]/50 bg-[#FE7F2D]/5 border border-[#FE7F2D]/10 px-2 py-0.5 rounded-full">
          v1.0.0
        </span>
      </div>

      {/* Two-column: ToC + content */}
      <div className="flex max-w-5xl mx-auto px-8">
        <DocNav sections={SECTIONS} active={active} onNavigate={scrollTo} />

        <div className="flex-1 min-w-0 py-10 pl-10 border-l border-white/5">
          {SECTIONS.map(({ id }, i) => (
            <div key={id}>
              <section
                id={id}
                ref={el => { refs.current[id] = el; }}
                className="scroll-mt-4"
              >
                {COMPONENTS[id]}
              </section>
              {i < SECTIONS.length - 1 && <hr className="my-10 border-white/5" />}
            </div>
          ))}

          <div className="mt-12 pt-6 border-t border-white/5 flex items-center gap-3">
            <BookOpen size={12} className="text-[#FE7F2D]" />
            <span className="text-[12px] text-slate-600 font-semibold">AutoDoc.ai</span>
            <span className="ml-auto text-[11px] text-slate-700">Node.js · React · TailwindCSS · Groq</span>
          </div>
        </div>
      </div>
    </div>
  );
}