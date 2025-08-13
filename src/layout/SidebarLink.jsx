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
      <Icon size={18} />
      <span className="text-sm">{label}</span>
    </Link>
  );
};

export default SidebarLink
