import React, { useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../components/Card';
import phrases from '../../data/lisSpell/phrases.json';
import sentences from '../../data/lisSpell/sentences.json';
import names from '../../data/lisSpell/names.json';
import { isCorrectStrict } from '../../utils/answerCheck';

const BANKS = { phrases, sentences, names };

export default function ListeningSpellingBank(){
  const { bank } = useParams();
  const items = useMemo(()=>BANKS[bank] || [], [bank]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const audioRef = useRef(null);

  if(!items.length){
    return <div className="p-6">Unknown bank: {bank}</div>;
  }
  const current = items[idx];

  function play(){ audioRef.current?.play(); }
  function check(){ setResult(isCorrectStrict(input, current.answers) ? 'correct' : 'wrong'); }
  function next(){ setResult(null); setInput(''); setIdx(i=>Math.min(i+1, items.length-1)); }
  function prev(){ setResult(null); setInput(''); setIdx(i=>Math.max(i-1, 0)); }

  return (
    <div className="space-y-4">
      <Card title={"Spelling · " + bank}>
        <div className="text-sm opacity-80 mb-2">Item {idx+1} of {items.length}</div>
        <div className="space-x-2">
          <button onClick={play} className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">Play</button>
          <button onClick={prev} disabled={idx===0} className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 disabled:opacity-50">Prev</button>
          <button onClick={next} disabled={idx===items.length-1} className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 disabled:opacity-50">Next</button>
        </div>
        <audio ref={audioRef} src={current.audio} preload="none" />
        <div className="mt-3">
          <input value={input} onChange={e=>setInput(e.target.value)} className="w-full rounded-xl border border-gray-200 dark:border-white/10 p-2 bg-white/80 dark:bg-white/5" placeholder="Type exactly what you heard…" />
        </div>
        <div className="mt-2">
          <button onClick={check} className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">Check</button>
        </div>
        {result && (
          <div className="mt-2">
            {result==='correct' ? <div className="text-green-700">✅ Correct!</div> : <div className="text-red-700">❌ Not quite. Expected: <span className="font-semibold">{current.answers[0]}</span></div>}
          </div>
        )}
      </Card>
      <div>
        <Link to="/practice/listening/spelling" className="text-sm underline opacity-80">← Back to Spelling menu</Link>
      </div>
    </div>
  );
}
