import React from 'react';
import Card from '../../../components/Card';
import PrimaryButton from '../../../components/PrimaryButton';
import { Link } from 'react-router-dom';
import manifest from '../../../data/paraphraseManifest.json';

export default function ParaphraseIndex() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Listening Paraphrasing</h1>
      <p className="text-gray-600">Hear three short lines, then match paraphrases and sequence them correctly. No scores yet — just instant feedback.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {manifest.sets.map(s => (
          <Card key={s.id}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-medium">{s.title}</h2>
                <p className="text-sm text-gray-500">3 lines · 2 tasks · ~20–40s audio</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to={`/practice/listening/paraphrase/${s.id}`}>
                <PrimaryButton>Start</PrimaryButton>
              </Link>
            </div>
          </Card>
        ))}
      </div>
      <div className="text-xs text-gray-500">
        Audio placeholders live under <code>/public/paraphrase/</code>. Replace <code>set1.mp3</code> and <code>set2.mp3</code> when ready.
      </div>
    </div>
  );
}