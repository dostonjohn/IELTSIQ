import React from 'react';
import Card from '../../../components/Card';
import PrimaryButton from '../../../components/PrimaryButton';
import { Link } from 'react-router-dom';

export default function ReadingParaphraseIndex(){
  return (
    <div className="space-y-6">
      {/* Header + back button share the same centered container */}
      <div className="relative max-w-5xl mx-auto">
        {/* Back button (top-right of the content column) */}
        <Link to="/practice/reading" className="absolute top-0 right-0">
          <button className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">
            Back
          </button>
        </Link>

        <h1 className="text-2xl font-semibold pr-28">Reading Paraphrase</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Train paraphrase recognition across three granularities: sentence, paragraph, and short passage.
        </p>
      </div>

      {/* Center the grid and stretch children */}
      <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3 items-stretch">
        {/* Sentence */}
        <Card>
          <div className="h-full flex flex-col">
            <div>
              <div className="font-medium">Sentence Mode</div>
              <p className="text-sm text-gray-600 dark:text-gray-300 min-h-[64px]">
                Micro‑drills: match synonyms, fill the blank, identify a paraphrase. (Using “Notes” can be helpful)
              </p>
            </div>
            <div className="mt-auto pt-4">
              <Link to="/practice/reading/paraphrase/sentence">
                <PrimaryButton>Start</PrimaryButton>
              </Link>
            </div>
          </div>
        </Card>

        {/* Paragraph */}
        <Card>
          <div className="h-full flex flex-col">
            <div>
              <div className="font-medium">Paragraph Mode</div>
              <p className="text-sm text-gray-600 dark:text-gray-300 min-h-[64px]">
                One solid paragraph (≈100 words): TF/NG, spot‑in‑text synonyms, and matching.
              </p>
            </div>
            <div className="mt-auto pt-4">
              <Link to="/practice/reading/paraphrase/paragraph">
                <PrimaryButton>Start</PrimaryButton>
              </Link>
            </div>
          </div>
        </Card>

        {/* Passage */}
        <Card>
          <div className="h-full flex flex-col">
            <div>
              <div className="font-medium">Passage Mode</div>
              <p className="text-sm text-gray-600 dark:text-gray-300 min-h-[64px]">
                Two short paragraphs (≈180–200 words): a compact IELTS‑style set of 5 paraphrase tasks.
              </p>
            </div>
            <div className="mt-auto pt-4">
              <Link to="/practice/reading/paraphrase/passage">
                <PrimaryButton>Start</PrimaryButton>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
