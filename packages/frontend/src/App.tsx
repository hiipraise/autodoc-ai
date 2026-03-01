import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Zap, ScrollText, Settings, BookOpen } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Settings_  from './pages/Settings';
import History   from './pages/History';
import Docs       from './pages/Docs';

const NAV = [
  { to: '/',       icon: Zap,        label: 'Dashboard' },
  { to: '/docs',   icon: BookOpen,   label: 'Docs'      },
  { to: '/history',icon: ScrollText, label: 'History'   },
  { to: '/settings',icon: Settings,  label: 'Settings'  },
];

export default function App() {
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
            <Route path="/"         element={<Dashboard />} />
            <Route path="/docs"     element={<Docs />} />
            <Route path="/history"  element={<History />} />
            <Route path="/settings" element={<Settings_ />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}