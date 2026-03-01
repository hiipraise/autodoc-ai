import { NavLink } from 'react-router-dom';

const NAV = [
  { to: '/',         icon: '⚡', label: 'Dashboard' },
  { to: '/history',  icon: '📜', label: 'History' },
  { to: '/settings', icon: '⚙️', label: 'Settings' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-14 bg-[#233D4D] border-r border-[#FE7F2D]/15 flex flex-col items-center py-4 gap-3 z-50">
      <div className="w-9 h-9 rounded-lg bg-[#FE7F2D] flex items-center justify-center text-white font-bold text-sm mb-3 shrink-0">
        A
      </div>
      {NAV.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          title={label}
          className={({ isActive }) =>
            `w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ` +
            (isActive
              ? 'bg-[#FE7F2D]/20 text-[#FE7F2D] shadow-inner'
              : 'text-slate-500 hover:text-slate-200 hover:bg-white/5')
          }
        >
          {icon}
        </NavLink>
      ))}
    </aside>
  );
}