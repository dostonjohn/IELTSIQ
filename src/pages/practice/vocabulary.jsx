
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
export default function Vocabulary(){
  const BOOKS=[1,2,3,4].map(i=>({id:i,title:`4000 Essential English Words ${i}`}));
  return (
    <div className="space-y-4">
      <Card title="Vocabulary">
        <p className="text-sm text-gray-600 dark:text-gray-300">Choose a book.</p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BOOKS.map(b=>(
            <div key={b.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-3 aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
                <span className="px-2 text-center text-sm font-semibold">{b.title}</span>
              </div>
              <Link to={`/practice/vocabulary/book/${b.id}`} className="block rounded-xl bg-indigo-600 px-4 py-2 text-center text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400">Open</Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
