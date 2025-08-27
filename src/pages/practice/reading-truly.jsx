import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import manifest from '../../data/readingTrulyManifest.json';

export default function ReadingTrulyIndex(){
  const topics = manifest.topics || [];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Reading Truly</h2>
        <Link to="/practice/reading">
          <button className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">Back</button>
        </Link>
      </div>

      <Card title="Choose a topic">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {topics.map(t => (
            <Link key={t.id} to={`/practice/reading/truly/${t.id}`}>
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 hover:shadow">
                <div className="aspect-video bg-gray-100 dark:bg-white/10">
                  {/* Use first article first image as cover */}
                  {t.articles && t.articles[0] && t.articles[0].images && (
                    <img src={t.articles[0].images[0]} alt={t.title} className="w-full h-full object-cover" loading="lazy" />
                  )}
                </div>
                <div className="p-3">
                  <div className="font-medium">{t.title}</div>
                  {t.subtitle && <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{t.subtitle}</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}