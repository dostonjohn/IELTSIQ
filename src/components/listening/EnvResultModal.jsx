import React from 'react';
import Modal from '../Modal';

export default function EnvResultModal({ open, results, transcript, onClose }) {
  if (!open) return null;
  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold mb-2">Results</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Gap-fill: {results.gap ? '✅' : '❌'}</li>
        <li>MCQ: {results.mcq ? '✅' : '❌'}</li>
        <li>Keyword: {results.keyword ? '✅' : '❌'}</li>
      </ul>
      <details className="mt-3">
        <summary className="cursor-pointer text-blue-600">Show transcript</summary>
        <p className="mt-2 whitespace-pre-wrap">{transcript}</p>
      </details>
      <button className="mt-4 bg-gray-600 text-white px-3 py-1 rounded" onClick={onClose}>Close</button>
    </Modal>
  );
}
