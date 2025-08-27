import React from 'react';
import { Link } from 'react-router-dom';
import manifest from '../../../data/listeningEnvironmentManifest.json';
import Card from '../../../components/Card';

export default function EnvIndex() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Listening Environment</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {manifest.sets.map(set=>(
          <Card key={set.id}>
            <h2 className="text-lg font-semibold">{set.title}</h2>
            <Link className="text-blue-600" to={`/practice/listening/environment/${set.id}`}>Start</Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
