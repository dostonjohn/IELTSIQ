import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../../../components/Card';
import manifest from '../../../data/readingTrulyManifest.json';

export default function TrulyArticle(){
  const { topicId, articleIdx } = useParams();
  const topic = (manifest.topics || []).find(t => t.id === topicId);
  if (!topic) return <div className="text-sm text-red-600">Topic not found.</div>;
  const idx = parseInt(articleIdx, 10) || 0;
  const article = topic.articles?.[idx];
  if (!article) return <div className="text-sm text-red-600">Article not found.</div>;

  const paragraphs = useMemo(() => {
    return (article.content || '').split(/\n\n+/).filter(Boolean);
  }, [article.content]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold truncate">{article.title}</h2>
          <div className="text-xs text-gray-600 dark:text-gray-300">Topic: {topic.title} • ~{article.approxWords} words</div>
        </div>
        <div className="flex gap-2">
          <Link to={`/practice/reading/truly/${topic.id}`}>
            <button className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">Back to {topic.title}</button>
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
        {article.images?.[0] && (
          <img src={article.images[0]} className="w-full aspect-video object-cover" alt={article.title} loading="lazy" />
        )}
        <div className="p-5 space-y-4 leading-7">
          {paragraphs.slice(0, Math.max(1, Math.ceil(paragraphs.length/2)-1)).map((p,i)=>(
            <p key={i} className="text-[15px]">{p}</p>
          ))}
          {article.images?.[1] && (
            <img src={article.images[1]} className="w-full rounded-xl my-2" alt="mid" loading="lazy" />
          )}
          {paragraphs.slice(Math.max(1, Math.ceil(paragraphs.length/2)-1)).map((p,i)=>(
            <p key={i+100} className="text-[15px]">{p}</p>
          ))}
        </div>
        {article.images?.[2] && (
          <img src={article.images[2]} className="w-full aspect-[3/1] object-cover" alt="end" loading="lazy" />
        )}
      </div>
    </div>
  );
}