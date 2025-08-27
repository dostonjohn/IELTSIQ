import React from 'react';
import Modal from '../Modal';
import PrimaryButton from '../PrimaryButton';

export default function MultiResultModal({ open, onClose, results, total, transcript }){
  const correct = results.filter(Boolean).length;
  return (
    <Modal open={open} onClose={onClose} title="Results">
      <div className="space-y-3">
        <div className="text-sm">Score: <strong>{correct}</strong> / {total}</div>
        <div className="grid grid-cols-5 gap-2">
          {results.map((ok, i)=>(
            <div key={i} className={"text-center text-xs rounded-xl border p-2 " + (ok ? "border-green-500/40" : "border-red-500/40")}>
              Q{i+1}: {ok ? "✅" : "❌"}
            </div>
          ))}
        </div>
        {transcript && (
          <details className="mt-2">
            <summary className="cursor-pointer select-none">Show transcript</summary>
            <pre className="text-xs whitespace-pre-wrap mt-2">{transcript}</pre>
          </details>
        )}
        <div className="flex items-center justify-end gap-2">
          <PrimaryButton onClick={onClose}>Close</PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}
