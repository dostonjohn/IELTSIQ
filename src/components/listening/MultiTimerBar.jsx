import React from 'react';

export default function MultiTimerBar({ msLeft=0, msTotal=7000 }){
  const pct = Math.max(0, Math.min(100, (msLeft / msTotal) * 100));
  return (
    <div className="h-2 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden" aria-label="buffer time remaining">
      <div className="h-full" style={{ width: pct + '%' }} />
    </div>
  );
}
