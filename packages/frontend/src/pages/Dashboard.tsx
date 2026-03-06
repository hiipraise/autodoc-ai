import { useState } from 'react';
import { Trees, Sparkles, Eye, FileText, GitCompare, Zap } from 'lucide-react';
import { Card }         from '../components/ui/Card';
import { Button }       from '../components/ui/Button';
import { FileTree }     from '../components/dashboard/FileTree';
import { ReadmePreview} from '../components/dashboard/ReadmePreview';
import { FeatureList }  from '../components/dashboard/FeatureList';
import { WatchStatus }  from '../components/dashboard/WatchStatus';
import { ScanProgress } from '../components/dashboard/ScanProgress';
import { DiffViewer }   from '../components/dashboard/DiffViewer';
import { useScanner }   from '../hooks/useScanner';
import { useReadme }    from '../hooks/useReadme';

export default function Dashboard() {
  const [dirInput, setDirInput]   = useState('.');
  const [activeTab, setActiveTab] = useState<'preview' | 'diff'>('preview');
  const { result, status, error, scan }                    = useScanner();
  const { content, previousContent, loading, regenerate } = useReadme();

  const handleScan = async () => {
    await scan(dirInput);
    await regenerate(dirInput);
  };

  const features = result?.features ?? [];

  return (
    <div className="min-h-screen bg-[#182c38] text-white">
      {/* Top bar */}
      <header className="bg-[#233D4D] border-b border-[#FE7F2D]/15 px-6 py-3 flex items-center gap-4">
        <span className="text-[#FE7F2D] font-mono font-bold text-base tracking-tight">AutoDoc.ai</span>
        <div className="flex-1 flex items-center gap-2 max-w-xl">
          <input
            type="text"
            value={dirInput}
            onChange={e => setDirInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleScan()}
            placeholder="Enter project directory path..."
            className="flex-1 bg-[#0f1f28] border border-[#FE7F2D]/15 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#FE7F2D] transition-colors"
          />
          <Button size="sm" loading={status === 'scanning' || loading} onClick={handleScan}>
            <Zap size={13} /> Generate
          </Button>
        </div>
      </header>

      <main className="p-6 grid grid-cols-12 gap-5">
        {status !== 'idle' && (
          <div className="col-span-12">
            <ScanProgress status={status} fileCount={result?.fileCount} error={error ?? undefined} />
          </div>
        )}

        {/* File tree + features */}
        <div className="col-span-12 lg:col-span-4 space-y-5">
          <Card title="File Tree" icon={<Trees size={13} />}>
            <FileTree tree={result?.tree ?? null} />
          </Card>
          <Card title="Extracted Features" icon={<Sparkles size={13} />}>
            <FeatureList features={features} />
          </Card>
        </div>

        {/* README preview / diff */}
        <div className="col-span-12 lg:col-span-5">
          <Card className="h-full">
            <div className="flex gap-2 mb-4">
              {([
                { key: 'preview', label: 'Preview', icon: <FileText  size={12} /> },
                { key: 'diff',    label: 'Diff',    icon: <GitCompare size={12} /> },
              ] as const).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
                    activeTab === tab.key ? 'bg-[#FE7F2D] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
            {activeTab === 'preview'
              ? <ReadmePreview content={content} isLoading={loading} />
              : <DiffViewer before={previousContent} after={content} />
            }
          </Card>
        </div>

        {/* Watch status */}
        <div className="col-span-12 lg:col-span-3">
          <Card title="Watch Mode" icon={<Eye size={13} />} className="h-full">
            <WatchStatus />
          </Card>
        </div>
      </main>
    </div>
  );
}