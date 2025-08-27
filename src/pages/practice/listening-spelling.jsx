import React from 'react';
import Card from '../../components/Card';
import { Link } from 'react-router-dom';

export default function ListeningSpelling(){
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Listening · Spelling</h2>
        <Link to="/practice/listening"><button className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">Back</button></Link>
      </div>
      <Card title="Choose a task style">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/practice/listening/spelling/word">
            <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3 hover:bg-black/5 dark:hover:bg-white/10">
              <div className="font-medium">Single Word Dictation</div>
              <p className="text-xs text-gray-600 dark:text-gray-300">Dictionary audio · infinite next</p>
            </div>
          </Link>
          <Link to="/practice/listening/spelling/phrases">
            <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3 hover:bg-black/5 dark:hover:bg-white/10">
              <div className="font-medium">Phrase Dictation</div>
              <p className="text-xs text-gray-600 dark:text-gray-300">2 sample audios</p>
            </div>
          </Link>
          <Link to="/practice/listening/spelling/sentences">
            <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3 hover:bg-black/5 dark:hover:bg-white/10">
              <div className="font-medium">Sentence Dictation</div>
              <p className="text-xs text-gray-600 dark:text-gray-300">2 sample audios</p>
            </div>
          </Link>
          <Link to="/practice/listening/spelling/names">
            <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3 hover:bg-black/5 dark:hover:bg-white/10">
              <div className="font-medium">Names & Numbers</div>
              <p className="text-xs text-gray-600 dark:text-gray-300">2 sample audios</p>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
}
