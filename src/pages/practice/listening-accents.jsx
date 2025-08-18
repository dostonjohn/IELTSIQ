import React from 'react';
import Card from '../../components/Card';

const ACCENTS = [
  { id: 'uk', label: 'British English', description: 'UK speakers and accent.' },
  { id: 'us', label: 'American English', description: 'US speakers and accent.' },
  { id: 'au', label: 'Australian English', description: 'Australian accent.' },
  { id: 'ca', label: 'Canadian English', description: 'Canadian accent.' },
  { id: 'others', label: 'Other Accents', description: 'Practice with a mix of global accents.' },
];

export default function ListeningAccents() {
  return (
    <div className="space-y-4">
      <Card title="Listening — Accents">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Choose an accent to practice. Each option features clips from speakers of that accent.
        </p>
      </Card>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ACCENTS.map((accent) => (
          <button
            key={accent.id}
            type="button"
            className="text-left rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10"
          >
            <div className="font-semibold">{accent.label}</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">{accent.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
