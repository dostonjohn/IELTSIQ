import React from 'react';
import Card from '../../components/Card';
import { Link } from 'react-router-dom';
import PrimaryButton from '../../components/PrimaryButton';

export default function ListeningMenu(){
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Listening Modes</h2>
        <Link to="/practice">
          <button className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">
            Back to Practice
          </button>
        </Link>
      </div>
      <Card title="Choose a mode">
        <div className="grid sm:grid-cols-2 gap-3">
          <Link to="/practice/listening/truly">
            <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3 hover:bg-black/5 dark:hover:bg-white/10">
              <div className="font-medium">Truly (Free Listening)</div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Short clips with human titles, no speed control.
              </p>
            </div>
          </Link>
          <Link to="/practice/listening/context">
            <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3 hover:bg-black/5 dark:hover:bg-white/10">
              <div className="font-medium">Context</div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                30s clips + 3 tasks (keywords, MCQ, transcript).
              </p>
            </div>
          </Link>
          <Link to="/practice/listening/accents">
            <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3 hover:bg-black/5 dark:hover:bg-white/10">
              <div className="font-medium">Accents</div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Identify accent + two micro-tasks.
              </p>
            </div>
          </Link>
          <Link to="/practice/listening/speed">
            <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3 hover:bg-black/5 dark:hover:bg-white/10">
              <div className="font-medium">Speed</div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Train comprehension at different speeds.
              </p>
            </div>
          </Link>
          <Link to="/practice/listening/multitasking">
            <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3 hover:bg-black/5 dark:hover:bg-white/10">
              <div className="font-medium">Multitasking</div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Listen + read + type under time windows.
              </p>
            </div>
          </Link>
          <Link to="/practice/listening/spelling">
            <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3 hover:bg-black/5 dark:hover:bg-white/10">
              <div className="font-medium">Spelling</div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Dictation drills: words, phrases, sentences.
              </p>
            </div>
          </Link>
          {/* Listening Environment */}
          <Link to="/practice/listening/environment">
            <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3 hover:bg-black/5 dark:hover:bg-white/10">
              <div className="font-medium">Environment</div>
              <p className="text-xs text-gray-600 dark:text-gray-300">30–35s clips with café/traffic ambience. 3 quick tasks.</p>
            </div>
          </Link>

          {/* NEW: Paraphrasing */}
          <Link to="/practice/listening/paraphrase">
            <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3 hover:bg-black/5 dark:hover:bg-white/10">
              <div className="font-medium">Paraphrasing</div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Match paraphrases and reorder sentences.
              </p>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
}
