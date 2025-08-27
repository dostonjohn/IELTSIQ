import React from 'react'
import { Award } from 'lucide-react'

const Badge = ({ label, color = "#F59E0B", icon: Icon = Award }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-white/10 p-3">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}1A`, color }}>
      <Icon size={18} />
    </div>
    <div>
      <div className="text-sm font-semibold">{label}</div>
      <div className="text-xs text-gray-500">Unlocked</div>
    </div>
  </div>
);

export default Badge
