import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const SidebarLink = ({ to, icon: Icon, label }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${active ? "bg-indigo-600 text-white" : "hover:bg-black/5 dark:hover:bg-white/10 text-gray-800 dark:text-gray-100"}`}
      aria-current={active ? "page" : undefined}
    >
      {to === '/practice' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 18v-7a2 2 0 0 1 2-2h5l2-2h5a2 2 0 0 1 2 2v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M4 18h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          <circle cx="8" cy="18" r="2" stroke="currentColor" strokeWidth="1.6"/>
          <circle cx="16" cy="18" r="2" stroke="currentColor" strokeWidth="1.6"/>
        </svg>
      ) : to === '/books' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3V4z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 7h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      ) : (
        <Icon size={18} />
      )}
      <span className="text-sm">{label}</span>
    </Link>
  );
};

export default SidebarLink
