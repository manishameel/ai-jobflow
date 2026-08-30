import { NavLink } from 'react-router-dom';
import { LayoutGrid, Briefcase, FileText, Settings, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const navItems = [
    { to: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { to: '/jobs', icon: Briefcase, label: 'Jobs' },
    { to: '/resume', icon: FileText, label: 'Resume' },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="w-60 h-screen bg-surface border-r border-border flex flex-col fixed left-0 top-0">

      <div className="p-6 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
          <span className="text-bg font-bold text-xs font-display">J</span>
        </div>
        <span className="font-display font-semibold text-sm tracking-tight">AI JobFlow</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ' +
              (isActive
                ? 'bg-accent/10 text-accent'
                : 'text-text-muted hover:bg-surface-hover hover:text-text-primary')
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium text-sm font-display">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-text-primary truncate">{user?.name}</p>
            <p className="text-xs text-text-muted truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 mt-1 rounded-lg text-sm text-text-muted hover:bg-surface-hover hover:text-status-rejected transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </div>
  );
}