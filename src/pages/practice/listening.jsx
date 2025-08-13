import React from 'react';
import Card from '../../components/Card';
import { Link } from 'react-router-dom';

export default function ListeningMenu() {
  return (
    <div className="space-y-4">
      <Card title="Listening Practice">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Choose a mode.
        </p>
      </Card>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Link to="/practice/listening/truly" className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">
          <div className="font-semibold">Listening Truly</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Enjoyable long-form listening.</div>
        </Link>
        <Link to="/practice/listening/context" className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">
          <div className="font-semibold">Listening Context</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">30s clip + quick tasks.</div>
        </Link>
        <Link to="/practice/listening/accents" className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">
          <div className="font-semibold">Accents</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">British, American, Australian…</div>
        </Link>
        <Link to="/practice/listening/speed" className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">
          <div className="font-semibold">Speed</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Train at different speeds.</div>
        </Link>
        <Link to="/practice/listening/multitasking" className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">
          <div className="font-semibold">Multitasking</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Listen + read + type.</div>
        </Link>
        <Link to="/practice/listening/spelling" className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">
          <div className="font-semibold">Spelling</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Dictation-based practice.</div>
        </Link>
        <Link to="/practice/listening/paraphrasing" className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">
          <div className="font-semibold">Paraphrasing</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Rewrite what you heard.</div>
        </Link>
        <Link to="/practice/listening/environment" className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">
          <div className="font-semibold">Environment</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Café, street, traffic noise.</div>
        </Link>
        <Link to="/practice/listening/types" className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">
          <div className="font-semibold">Question Types</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">IELTS-style tasks.</div>
        </Link>
      </div>
    </div>
  );
}