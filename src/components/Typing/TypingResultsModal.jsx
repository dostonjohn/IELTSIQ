import React, { useEffect } from 'react'
import PrimaryButton from '../PrimaryButton'

const TypingResultsModal = ({ open, onClose, stats }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0B0D12] shadow-xl p-5">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold">Session results</h3>
            <button className="text-gray-500 hover:text-gray-900 dark:hover:text-white" onClick={onClose} aria-label="Close">✖</button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3 text-center">
              <div className="text-xs text-gray-500">WPM</div>
              <div className="text-2xl font-bold tabular-nums">{stats?.wpm ?? 0}</div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3 text-center">
              <div className="text-xs text-gray-500">Words</div>
              <div className="text-lg font-semibold tabular-nums">{stats?.words ?? 0}</div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3 text-center">
              <div className="text-xs text-gray-500">Chars</div>
              <div className="text-lg font-semibold tabular-nums">{stats?.chars ?? 0}</div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <PrimaryButton as="button" onClick={onClose} style={{ background: '#111827' }}>Close</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingResultsModal
