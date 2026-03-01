import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Check } from 'lucide-react';
import { Card }   from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { api }    from '../lib/api';
import type { AutoDocConfig } from '../lib/types';

export default function Settings() {
  const [config,  setConfig]  = useState<AutoDocConfig | null>(null);
  const [saved,   setSaved]   = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.config.get().then(res => res.data && setConfig(res.data));
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setLoading(true);
    await api.config.update(config);
    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!config) {
    return (
      <div className="min-h-screen bg-[#182c38] flex items-center justify-center text-slate-500 text-sm">
        Loading config...
      </div>
    );
  }

  const field = (label: string, el: React.ReactNode) => (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-1.5">
        {label}
      </span>
      {el}
    </label>
  );

  const input = (value: string | number, onChange: (v: string) => void, type = 'text') => (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-[#0f1f28] border border-[#FE7F2D]/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FE7F2D] transition-colors"
    />
  );

  return (
    <div className="min-h-screen bg-[#182c38] text-white p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon size={18} className="text-[#FE7F2D]" />
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      <div className="space-y-4">
        <Card title="AI Provider" icon={<SettingsIcon size={13} />}>
          <div className="space-y-3">
            {field('Provider',
              <select
                value={config.ai.provider}
                onChange={e => setConfig({ ...config, ai: { ...config.ai, provider: e.target.value } })}
                className="w-full bg-[#0f1f28] border border-[#FE7F2D]/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FE7F2D]"
              >
                <option value="groq">Groq (Free, recommended)</option>
                <option value="ollama">Ollama (Local, no API key)</option>
              </select>
            )}
            {field('Model', input(config.ai.model, v => setConfig({ ...config, ai: { ...config.ai, model: v } })))}
          </div>
        </Card>

        <Card title="Scan Settings" icon={<SettingsIcon size={13} />}>
          <div className="grid grid-cols-2 gap-3">
            {field('Max Depth',
              input(config.scan.maxDepth, v => setConfig({ ...config, scan: { ...config.scan, maxDepth: +v } }), 'number')
            )}
            {field('Max File Size (KB)',
              input(config.scan.maxFileSizeKB, v => setConfig({ ...config, scan: { ...config.scan, maxFileSizeKB: +v } }), 'number')
            )}
          </div>
        </Card>

        <Card title="Watch Mode" icon={<SettingsIcon size={13} />}>
          {field('Debounce Delay (ms)',
            input(config.watch.debounceMs, v => setConfig({ ...config, watch: { ...config.watch, debounceMs: +v } }), 'number')
          )}
        </Card>

        <Button onClick={handleSave} loading={loading} size="lg" className="w-full">
          {saved ? <><Check size={15} /> Saved</> : <><Save size={15} /> Save Settings</>}
        </Button>
      </div>
    </div>
  );
}