import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../../../components/Card';
import manifest from '../../../data/readingTrulyManifest.json';

export default function TrulyTopic(){
  const { topicId } = useParams();
  const topic = (manifest.topics || []).find(t => t.id === topicId);
  if (!topic) {
    return <div className="text-sm text-red-600">Topic not found.</div>
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{topic.title}</h2>
        <div className="flex gap-2">
          <Link to="/practice/reading/truly">
            <button className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">All topics</button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {topic.articles.map((a, idx) => (
          <Link key={a.id} to={`/practice/reading/truly/${topic.id}/${idx}`}>
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 hover:shadow">
              <div className="aspect-video bg-gray-100 dark:bg-white/10">
                <img src={a.images?.[0]} alt={a.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-3">
                <div className="text-sm font-medium">{a.title}</div>
                <div className="text-[11px] mt-1 text-gray-600 dark:text-gray-300">
                  ~{a.approxWords} words • 3 images
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}