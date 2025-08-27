import React from 'react';
import Card from '../../components/Card';
import { Link } from 'react-router-dom';
import PrimaryButton from '../../components/PrimaryButton';

export default function ReadingMenu(){
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Reading Modes</h2>
        <Link to="/practice">
          <button className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">
            Back to Practice
          </button>
        </Link>
      </div>

      <Card title="Choose the mode">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Pick a mode. Start with <span className="font-medium">Reading Truly</span> for enjoyable, long-form reading.
        </p>
        <div className="grid md:grid-cols-2 gap-3 mt-3">
          <Link to="/practice/reading/truly">
            <div className="rounded-xl border border-gray-200 dark:border-white/10 p-4 hover:bg-black/5 dark:hover:bg-white/10">
              <div className="font-medium">Reading Truly</div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Topic-based long reads with images. No test stress, just flow.
              </p>
            </div>
          </Link>

          
          <Link to="/practice/reading/paraphrase" className="block">
            <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden hover:shadow-md transition">
              <div className="p-3">
                <div className="font-medium">Reading Paraphrase</div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                  Sentence, paragraph, and passage paraphrase drills. Identify synonyms, match phrases
                </p>
              </div>
            </div>
          </Link>


          <Link to="/practice/reading/speed-note" className="block">
            <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden hover:shadow-md transition">
              <div className="p-3">
                <div className="font-medium">Reading Speed &amp; Note</div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                  45s skim, pin 3 words, one 10s peek. Then answer 3 quick questions.
                </p>
              </div>
            </div>
          </Link>


          {/* Future modes can go here */}
          <div className="rounded-xl border border-dashed border-gray-200 dark:border-white/10 p-4 opacity-60">
            <div className="font-medium">Coming soon</div>
            <p className="text-xs text-gray-600 dark:text-gray-300">Skimming, headings, and matching tasks.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}