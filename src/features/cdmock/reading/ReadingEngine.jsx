import React, { useEffect, useRef, useState } from 'react';
import Card from '../../../components/Card';
import PrimaryButton from '../../../components/PrimaryButton';

const PassageChip = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 rounded-xl text-sm border transition
      ${active ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' 
               : 'bg-transparent text-gray-800 dark:text-gray-100 border-gray-300 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10'}`}
    aria-pressed={active}
  >
    {children}
  </button>
);

export default function ReadingEngine() {
  const [active, setActive] = useState(1);
  const frameRef = useRef(null);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    // Toggle focus CSS class on body
    if (focus) {
      document.body.classList.add('is-reading-full');
      // Try to enter fullscreen (may fail without user gesture)
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen().catch(()=>{});
    } else {
      document.body.classList.remove('is-reading-full');
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(()=>{});
      }
    }
    return () => {
      document.body.classList.remove('is-reading-full');
    };
  }, [focus]);

  useEffect(() => {
    // Auto-enable focus when user lands here (first interaction happens on tab click)
    setFocus(true);
  }, []);

  const src = active === 1 ? '/reading/passage1.html'
            : active === 2 ? '/reading/passage2.html'
            : '/reading/passage3.html';

  return (
    <div className="space-y-3">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PassageChip active={active===1} onClick={()=>setActive(1)}>Passage 1</PassageChip>
            <PassageChip active={active===2} onClick={()=>setActive(2)}>Passage 2</PassageChip>
            <PassageChip active={active===3} onClick={()=>setActive(3)}>Passage 3</PassageChip>
          </div>
          <div className="flex items-center gap-2">
            <PrimaryButton onClick={()=>setFocus(f=>!f)}>
              {focus ? 'Exit Focus' : 'Focus mode'}
            </PrimaryButton>
          </div>
        </div>
      </Card>

      <div className="rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
        <iframe
          ref={frameRef}
          title={`IELTS Reading — Passage ${active}`}
          src={src}
          style={{ width: '100%', height: 'calc(100vh - 220px)' }}
        />
      </div>
    </div>
  );
}