import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Zap, ScrollText, Settings, BookOpen, Monitor } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Settings_ from './pages/Settings';
import History from './pages/History';
import Docs from './pages/Docs';

const NAV = [
  { to: '/', icon: Zap, label: 'Dashboard' },
  { to: '/docs', icon: BookOpen, label: 'Docs' },
  { to: '/history', icon: ScrollText, label: 'History' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const MIN_DESKTOP_WIDTH = 1100;

export default function App() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= MIN_DESKTOP_WIDTH);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= MIN_DESKTOP_WIDTH);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!isDesktop) {
    return (
      <div className="min-h-screen bg-[#182c38] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-xl border border-[#FE7F2D]/20 bg-[#233D4D] p-6 text-center">
          <div className="mx-auto mb-3 w-11 h-11 rounded-lg bg-[#FE7F2D]/20 flex items-center justify-center text-[#FE7F2D]">
            <Monitor size={20} />
          </div>
          <h1 className="text-lg font-bold mb-2">Desktop View Required</h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            AutoDoc is optimized for desktop/high-resolution screens and does not support mobile layouts.
            Please open this app on a desktop device or enlarge your browser window.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#182c38]">
        <nav className="fixed top-0 left-0 h-full w-14 bg-[#233D4D] border-r border-[#FE7F2D]/15 flex flex-col items-center py-4 gap-3 z-50">
          <div className="w-9 h-9 rounded-lg bg-[#FE7F2D] flex items-center justify-center text-white font-bold text-sm mb-3 shrink-0">
            A
          </div>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              title={label}
              className={({ isActive }) =>
                `w-10 h-10 rounded-lg flex items-center justify-center transition-all ` +
                (isActive
                  ? 'bg-[#FE7F2D]/20 text-[#FE7F2D]'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/5')
              }
            >
              <Icon size={18} />
            </NavLink>
          ))}
        </nav>
        <div className="pl-14">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings_ />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
