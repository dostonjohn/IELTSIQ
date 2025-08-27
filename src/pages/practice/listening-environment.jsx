import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import manifest from '../../data/listeningEnvironmentManifest.json';

export default function ListeningEnvironmentIndex(){
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Listening Environment</h2>
        <Link to="/practice/listening">
          <button className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">Change mode</button>
        </Link>
      </div>

      <Card title="Train with real-world ambience">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          Each set: ~30–35s audio · 3 quick tasks (gap fill, MCQ, keyword).
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {manifest.sets.map(s => (
            <Link key={s.id} to={`/practice/listening/environment/${s.id}`}>
              <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3 hover:bg-black/5 dark:hover:bg-white/10">
                <div className="font-medium">{s.title}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">{s.durationSec}s · 3 tasks</div>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}