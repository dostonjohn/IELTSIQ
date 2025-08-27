// src/components/mock/TimerBadge.jsx
import React from 'react';
const pad = (n) => String(n|0).padStart(2,'0');
export default function TimerBadge({ seconds=0 }){
  const m = Math.floor(seconds/60), s = seconds%60;
  return (
    <div className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 text-sm tabular-nums">
      {m}:{pad(s)}
    </div>
  );
}
