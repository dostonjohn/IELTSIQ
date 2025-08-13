// src/components/Modal.jsx
import React, { useEffect, useRef } from 'react';

export default function Modal({ open, title='Result', children, onClose }) {
  const dialogRef = useRef(null);
  const lastFocus = useRef(null);

  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement;
      setTimeout(() => dialogRef.current?.focus(), 0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (lastFocus.current && lastFocus.current.focus) lastFocus.current.focus();
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true"></div>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={dialogRef}
        className="relative max-w-2xl w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-4"
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="text-base font-semibold">{title}</h3>
          <button onClick={onClose} className="px-2 py-1 rounded-md border border-gray-200 dark:border-white/10">Close</button>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none">{children}</div>
      </div>
    </div>
  );
}
