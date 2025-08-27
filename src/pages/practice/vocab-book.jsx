
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../../components/Card';
import { getLastScore } from '../../utils/vocabStorage';
import book1 from '../../data/vocab/book1.json';
import book2 from '../../data/vocab/book2.json';
import book3 from '../../data/vocab/book3.json';
import book4 from '../../data/vocab/book4.json';
const byId={1:book1,2:book2,3:book3,4:book4};
export default function VocabBook(){
  const {bookId}=useParams(); const id=Number(bookId); const book=byId[id]||book1;
  return (
    <div className="space-y-4">
      <Card title={book.title}>
        <p className="text-sm text-gray-600 dark:text-gray-300">30 units · 20 words each</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {book.units.map(u=>{
            const last=getLastScore(book.book,u.id);
            return (
              <div key={u.id} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-2 flex items-center justify-between">
                  <div className="font-semibold text-gray-900 dark:text-white">Unit {u.id}</div>
                  {last?<span className="rounded-md bg-emerald-50 dark:bg-emerald-900/40 px-2 py-1 text-sm text-emerald-700 dark:text-emerald-300">Last: {last.score}/{last.total}</span>:
                    <span className="rounded-md bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm text-gray-500 dark:text-gray-400">No attempt</span>}
                </div>
                <Link to={`/practice/vocabulary/book/${book.book}/unit/${u.id}`} className="block rounded-lg bg-indigo-600 px-4 py-2 text-center text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400">Start</Link>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
