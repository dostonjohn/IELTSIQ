import React from 'react';
import Card from '../../components/Card';
import { Link } from 'react-router-dom';
import manifest from '../../data/multitaskingManifest.json';

function StageCard({ n, title, subtitle }){
  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3">
      <div className="font-medium">{title}</div>
      <div className="text-xs text-gray-600 dark:text-gray-300">{subtitle}</div>
      <div className="mt-2 flex gap-2">
        {manifest.sets.map(s => (
          <Link key={s.id} to={`/practice/listening/multitasking/set/${s.id}?stage=${n}`}>
            <button className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm">Start {s.title}</button>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function ListeningMultitaskingIndex(){
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Listening Multitasking</h2>
        <Link to="/practice/listening"><button className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">Change mode</button></Link>
      </div>
      <Card title="3 stages · 5 questions · ~1–2 minutes">
        <div className="grid sm:grid-cols-3 gap-3">
          <StageCard n={1} title="Stage 1 — Comfortable" subtitle="Audio pauses at each cue. Continue when ready." />
          <StageCard n={2} title="Stage 2 — Timed buffer" subtitle="Continuous audio. 7s answer window." />
          <StageCard n={3} title="Stage 3 — Realistic" subtitle="Continuous audio. 5s window. No replay." />
        </div>
      </Card>
      <Card title="About this mode">
        <ul className="text-sm list-disc pl-5 space-y-1">
          <li>Inputs unlock only when the audio reaches the cue time.</li>
          <li>Tasks: two short inputs + one typed True/False.</li>
          <li>Score shown at the end with an optional transcript.</li>
        </ul>
      </Card>
    </div>
  );
}
