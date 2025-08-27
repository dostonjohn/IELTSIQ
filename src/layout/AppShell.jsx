import React from 'react'
import SidebarLink from './SidebarLink'
import QuickNotePortal from '../components/notes/QuickNotePortal'
import MiniPlayer from '../components/audio/MiniPlayer'
import {
  Home as HomeIcon, Info as InfoIcon, Trophy, User, Settings as SettingsIcon,
  LogOut, FileText, ListChecks, Keyboard, BookOpen, Play, StickyNote, Coffee
} from 'lucide-react'

const AppShell = ({ children }) => (
  <div className="min-h-screen w-full text-gray-900 dark:text-gray-100">
    <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 md:gap-6 p-4 md:p-6">
      <aside
        className="ieltsiq-sidebar sticky top-4 h-max rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur p-4"
        style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.07)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600" aria-hidden />
            <div>
              <p className="text-sm font-semibold">IELTSIQ</p>
              <p className="text-xs text-gray-500">What’s your IELTSIQ?</p>
            </div>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          <SidebarLink to="/" icon={HomeIcon} label="Home" />
          <SidebarLink to="/sets" icon={ListChecks} label="Question Sets" />
          <SidebarLink to="/clips" icon={Play} label="Clips" />
          <SidebarLink to="/off-time" icon={Coffee} label="Off Time" />
          <SidebarLink to="/practice" icon={ListChecks} label="Practice" />
          <SidebarLink to="/books" icon={BookOpen} label="Books" />
          <SidebarLink to="/mock" icon={FileText} label="CD Mock" />
          <SidebarLink to="/typing" icon={Keyboard} label="Typing" />
          <SidebarLink to="/notes" icon={StickyNote} label="Notes" />
          <SidebarLink to="/leaderboards" icon={Trophy} label="Leaderboards" />
          <SidebarLink to="/profile" icon={User} label="Profile" />
          <SidebarLink to="/info" icon={InfoIcon} label="Info" />
          <SidebarLink to="/settings" icon={SettingsIcon} label="Settings" />
          <SidebarLink to="/logout" icon={LogOut} label="Logout" />
        </nav>
        <div className="mt-6 text-xs text-gray-500">
          <p>v3 • WCAG-friendly • 8pt spacing</p>
        </div>
      </aside>

      <main className="space-y-4 md:space-y-6">{children}
        <QuickNotePortal />
      </main>
        <MiniPlayer />
    </div>
  </div>
);

export default AppShell
