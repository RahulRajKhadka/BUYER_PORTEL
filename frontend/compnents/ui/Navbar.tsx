import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Heart, Search, LogOut, User, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { useAuth } from '../../hooks/useAuth.js';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/browse', label: 'Browse', icon: Search },
  { to: '/favourites', label: 'Favourites', icon: Heart },
];

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
            <Home className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-semibold text-stone-800 text-lg hidden sm:block">
            RealtyPortal
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={clsx(
                'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                pathname === to
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-stone-500 hover:bg-stone-100 hover:text-stone-700'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:block">{label}</span>
            </Link>
          ))}
        </nav>

        {/* User menu */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-stone-100 transition-all duration-200"
          >
            <div className="w-7 h-7 rounded-lg bg-brand-100 flex items-center justify-center">
              <User className="w-4 h-4 text-brand-700" />
            </div>
            <span className="text-sm font-medium text-stone-700 hidden sm:block max-w-[120px] truncate">
              {user?.name}
            </span>
            <ChevronDown className={clsx('w-4 h-4 text-stone-400 transition-transform duration-200', open && 'rotate-180')} />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-lg border border-stone-100 py-2 animate-scale-in">
              <div className="px-4 py-2 border-b border-stone-100 mb-1">
                <p className="text-sm font-medium text-stone-800 truncate">{user?.name}</p>
                <p className="text-xs text-stone-400 truncate">{user?.email}</p>
                <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-700 capitalize">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={() => { setOpen(false); logout(); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors duration-150"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};