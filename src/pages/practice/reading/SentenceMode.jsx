
import React, { useState } from 'react';
import Card from '../../../components/Card';
import PrimaryButton from '../../../components/PrimaryButton';
import { Link } from 'react-router-dom';
import manifest from '../../../data/readingParaphraseManifest.json';
import { normalize, inAccepted, selectMatchIsCorrect } from '../../../utils/readingParaphraseCheck';

export default function SentenceMode(){
  const sets = manifest.sentenceMode;
  const [idx, setIdx] = useState(0);
  const item = sets[idx];

  // match synonyms via selects
  const [selections, setSelections] = useState({});
  const setSel = (key, val) => setSelections(s => ({...s, [key]: val}));

  const [fillInput, setFillInput] = useState('');
  const [mcq, setMcq] = useState(null);
  const [result, setResult] = useState(null);

  const check = ()=>{
    const matchOK = selectMatchIsCorrect(item.tasks.matchSynonyms.answers, selections);
    const fillOK = inAccepted(fillInput, item.tasks.fillBlank.accepted);
    const mcqOK = Number(mcq) === item.tasks.identifyParaphrase.answerIndex;
    setResult({matchOK, fillOK, mcqOK});
  };

  const reset = ()=>{ setSelections({}); setFillInput(''); setMcq(null); setResult(null); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sentence Mode</h1>
        <Link to="/practice/reading/paraphrase" className="text-blue-600 underline">
        <button className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">
            Back
         </button>
        </Link>
      </div>

      <Card>
        <div className="text-lg">Sentence : {item.source}</div>

        <div className="mt-4 space-y-4">
          <div>
            <div className="font-medium">1. Match synonyms</div>
            {item.tasks.matchSynonyms.highlight.map((h) => (
              <div key={h} className="mt-2 flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800">{h}</span>
                <select className="px-2 py-1 rounded border" value={selections[h]||''} onChange={e=>setSel(h, e.target.value)}>
                  <option value="">Choose synonym</option>
                  {item.tasks.matchSynonyms.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div>
            <div className="font-medium">2. Fill in the blank</div>
            <div className="mt-1">{item.tasks.fillBlank.stem}</div>
            <input className="mt-2 px-2 py-1 rounded border w-full" value={fillInput} onChange={e=>setFillInput(e.target.value)} placeholder="Type a synonym" />
          </div>

          <div>
            <div className="font-medium">3. Identify the paraphrase</div>
            <div className="mt-2">{item.tasks.identifyParaphrase.question}</div>
            <div className="mt-2 space-y-2">
              {item.tasks.identifyParaphrase.options.map((opt, i)=>(
                <label key={i} className="flex items-center gap-2">
                  <input type="radio" name="mcq" checked={mcq===i} onChange={()=>setMcq(i)} />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <PrimaryButton onClick={check}>Check answers</PrimaryButton>
          <button className="px-3 py-1.5 rounded-xl border" onClick={reset}>Reset</button>
        </div>

        {result && (
          <div className="mt-3 text-sm">
            <div>Match: {result.matchOK ? '✅' : '❌'}</div>
            <div>Blank: {result.fillOK ? '✅' : '❌'}</div>
            <div>Paraphrase: {result.mcqOK ? '✅' : '❌'}</div>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between">
        <button className="px-3 py-1.5 rounded-xl border" disabled={idx===0} onClick={()=>{setIdx(i=>i-1); reset();}}>Prev</button>
        <button className="px-3 py-1.5 rounded-xl border" disabled={idx===sets.length-1} onClick={()=>{setIdx(i=>i+1); reset();}}>Next</button>
      </div>
    </div>
  );
}
