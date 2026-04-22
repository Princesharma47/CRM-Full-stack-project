import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ─── Nav config ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    path:  '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
           strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    path:  '/leads',
    label: 'Leads',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
           strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    path:  '/properties',
    label: 'Properties',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
           strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
  },
  {
    path:  '/deals',
    label: 'Deals',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
           strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
      </svg>
    ),
  },
  {
    path:  '/life-at-agnayi',
    label: 'Life at Agnayi',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
           strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
      </svg>
    ),
  },
];

// ─── Sidebar Component ────────────────────────────────────────────────────────
const Sidebar = ({ children }) => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  // ── Shared nav item renderer ──────────────────────────────────────────────
  const NavItem = ({ item, mini }) => {
    const active = pathname === item.path;
    return (
      <Link
        to={item.path}
        onClick={() => setMobileOpen(false)}
        title={mini ? item.label : undefined}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group relative
          ${active
            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
          }
          ${mini ? 'justify-center' : ''}`}
      >
        <span className={`shrink-0 ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-700'}`}>
          {item.icon}
        </span>
        {!mini && <span>{item.label}</span>}

        {/* Tooltip when collapsed */}
        {mini && (
          <span className="absolute left-full ml-3 px-2.5 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-50 shadow-lg">
            {item.label}
          </span>
        )}
      </Link>
    );
  };

  // ── Sidebar inner content ─────────────────────────────────────────────────
  const SidebarContent = ({ mini }) => (
    <div className={`flex flex-col h-full ${mini ? 'items-center' : ''}`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-3 py-5 shrink-0 ${mini ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-600/30 shrink-0">
          <span className="text-white text-xs font-black">CR</span>
        </div>
        {!mini && (
          <div>
            <span className="font-black text-gray-900 text-base tracking-tight">RealCRM</span>
            <p className="text-[10px] text-gray-400 font-medium -mt-0.5">Real Estate Suite</p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className={`border-t border-gray-100 mx-3 mb-4`} />

      {/* Nav label */}
      {!mini && (
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">
          Main Menu
        </p>
      )}

      {/* Nav links */}
      <nav className={`flex flex-col gap-1 px-2 flex-1 ${mini ? 'w-full items-center' : ''}`}>
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.path} item={item} mini={mini} />
        ))}
      </nav>

      {/* Bottom: user card */}
      <div className={`shrink-0 border-t border-gray-100 p-3 ${mini ? 'flex flex-col items-center gap-2' : ''}`}>
        {!mini && (
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors mb-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
              <p className="text-[11px] text-gray-400 truncate capitalize">{user?.role || 'Agent'}</p>
            </div>
          </div>
        )}

        {mini && (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm mb-1" title={user?.name}>
            {initials}
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 text-xs text-gray-500 hover:text-red-500 transition-colors font-semibold
            ${mini ? 'justify-center w-full p-2 rounded-xl hover:bg-red-50' : 'px-2 py-1.5 w-full rounded-xl hover:bg-red-50'}`}
          title={mini ? 'Logout' : undefined}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!mini && 'Logout'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ── Desktop Sidebar ──────────────────────────────────────────────── */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-gray-100 shadow-sm transition-all duration-300 ease-in-out shrink-0
          ${collapsed ? 'w-[72px]' : 'w-60'}`}
      >
        {/* Collapse toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute left-0 top-16 z-10 -translate-x-0 translate-x-[56px] bg-white border border-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-900 shadow-md hover:shadow-lg transition-all hover:scale-110"
          style={{ left: collapsed ? '58px' : '228px' }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg className={`w-3 h-3 transition-transform ${collapsed ? '' : 'rotate-180'}`}
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <SidebarContent mini={collapsed} />
      </aside>

      {/* ── Mobile Overlay ───────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Sidebar Drawer ────────────────────────────────────────── */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 shadow-xl z-50 lg:hidden
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent mini={false} />
      </aside>

      {/* ── Main Content Area ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Top Bar (mobile hamburger + breadcrumb) ─────────────────── */}
        <header className="bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-4 py-3 shrink-0">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          {/* Breadcrumb / Current page */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm font-bold text-gray-700 capitalize">
              {NAV_ITEMS.find((n) => n.path === pathname)?.label || 'RealCRM'}
            </span>
          </div>

          {/* Right side — user pill on mobile */}
          <div className="flex items-center gap-2">
            <div className="lg:hidden flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-[10px]">
                {initials}
              </div>
              <span className="text-xs font-semibold text-gray-700 max-w-[80px] truncate">{user?.name}</span>
            </div>
            {/* Notification bell placeholder */}
            <button className="hidden lg:flex w-8 h-8 items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </header>

        {/* ── Page Content ─────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
