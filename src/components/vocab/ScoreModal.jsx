
import React from 'react';
import Modal from '../Modal';
export default function ScoreModal({ open, score, total, onClose, onRetry, onBackToUnits }){
  if(!open) return null;
  const pct = Math.round((score/total)*100);
  const title = pct===100 ? "Perfect!" : pct>=80 ? "Nice work!" : pct>=50 ? "Keep going" : "Try again";
  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-2">
        <div className="mb-2 text-center text-2xl font-bold">{title}</div>
        <div className="mb-4 text-center text-gray-700 dark:text-gray-200">Score: <span className="font-semibold text-gray-900 dark:text-white">{score}</span> / {total} ({pct}%)</div>
        <div className="flex gap-2">
          <button onClick={onBackToUnits} className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800">Back to units</button>
          <button onClick={onRetry} className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">Retry</button>
          <button onClick={onClose} className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800">Close</button>
        </div>
      </div>
    </Modal>
  );
}
