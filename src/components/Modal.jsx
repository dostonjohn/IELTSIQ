import React, { useEffect, useRef } from 'react';
import PrimaryButton from './PrimaryButton';

export default function Modal({ open, title='Results', children, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    if (open && ref.current) ref.current.focus();
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-xl rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black p-4 shadow-xl space-y-3"
      >
        <div className="flex items-center justify-between">
          <h3 id="modal-title" className="text-lg font-semibold">{title}</h3>
          <button
            ref={ref}
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10"
          >Close</button>
        </div>
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}