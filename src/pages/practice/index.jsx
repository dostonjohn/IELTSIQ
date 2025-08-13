import React from 'react';
import Card from '../../components/Card';
import { Link } from 'react-router-dom';

export default function PracticeHub() {
  return (
    <div className="space-y-4">
      <Card title="Practice">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Pick a skill cluster to start practicing.
        </p>
      </Card>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Link to="/practice/listening" className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">
          <div className="font-semibold">Listening</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Truly, Context, Accents, Speed…</div>
        </Link>
        <Link to="/practice/reading" className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">
          <div className="font-semibold">Reading</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Long-form, timed microtasks…</div>
        </Link>
        <Link to="/practice/writing" className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">
          <div className="font-semibold">Writing</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Task 1 Big Picture, paraphrasing…</div>
        </Link>
        <Link to="/practice/speaking" className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">
          <div className="font-semibold">Speaking</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Record and review with timers…</div>
        </Link>
        <Link to="/practice/vocabulary" className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">
          <div className="font-semibold">Vocabulary</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">SRS decks, collocations…</div>
        </Link>
        <Link to="/practice/grammar" className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">
          <div className="font-semibold">Grammar</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Micro-skill drills.</div>
        </Link>
        <Link to="/practice/wellbeing" className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">
          <div className="font-semibold">Well-being</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Focus music & calming routines.</div>
        </Link>
      </div>
    </div>
  );
}