
import React, { useState } from 'react';
import Card from '../../../components/Card';
import PrimaryButton from '../../../components/PrimaryButton';
import { Link } from 'react-router-dom';
import manifest from '../../../data/readingParaphraseManifest.json';
import { inAccepted } from '../../../utils/readingParaphraseCheck';

export default function PassageMode(){
  const sets = manifest.passageMode;
  const [idx, setIdx] = useState(0);
  const item = sets[idx];

  const [tfng, setTfng] = useState({});
  const [spotText, setSpotText] = useState({});
  const [mcq, setMcq] = useState(null);
  const [blank, setBlank] = useState('');
  const [result, setResult] = useState(null);

  const check = ()=>{
    const tfOK = item.tasks.tfng.every((q, i)=> (tfng[i]||'').toLowerCase() === q.answer);
    const spotOK = item.tasks.spotSynonym.every((q,i)=> inAccepted(spotText[i]||'', q.accepted));
    const mcqOK = Number(mcq) === item.tasks.identifyParaphrase.answerIndex;
    const blankOK = inAccepted(blank, item.tasks.fillBlank.accepted);
    setResult({tfOK, spotOK, mcqOK, blankOK});
  };
  const reset = ()=>{ setTfng({}); setSpotText({}); setMcq(null); setBlank(''); setResult(null); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Passage Mode</h1>
        <Link to="/practice/reading/paraphrase" className="text-blue-600 underline">
        <button className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">
            Back
          </button>
        </Link>
      </div>

      <Card>
        <div className="prose dark:prose-invert max-w-none">
          {item.passage.map((para, i)=>(<p key={i}>{para}</p>))}
        </div>

        <div className="mt-4 space-y-6">
          <div>
            <div className="font-medium">True/False/Not Given</div>
            <div className="mt-2 space-y-2">
              {item.tasks.tfng.map((q, i)=>(
                <div key={i} className="p-2 rounded border">
                  <div className="text-sm">{q.statement}</div>
                  <div className="mt-1 flex gap-3">
                    {['true','false','not given'].map(opt => (
                      <label key={opt} className="flex items-center gap-2 text-sm">
                        <input type="radio" name={`tf${i}`} checked={(tfng[i]||'')===opt} onChange={()=>setTfng(s=>({...s, [i]: opt}))} />
                        <span className="capitalize">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="font-medium">Spot the synonym in context</div>
            <div className="mt-2 space-y-2">
              {item.tasks.spotSynonym.map((q, i)=>(
                <div key={i} className="p-2 rounded border">
                  <div className="text-sm">{q.prompt}</div>
                  <input className="mt-2 px-2 py-1 rounded border w-full" placeholder="Type the exact phrase from the passage" value={spotText[i]||''} onChange={e=>setSpotText(s=>({...s, [i]: e.target.value}))}/>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="font-medium">Identify the paraphrase</div>
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

          <div>
            <div className="font-medium">Fill in the blank</div>
            <div className="mt-1">{item.tasks.fillBlank.stem}</div>
            <input className="mt-2 px-2 py-1 rounded border w-full" value={blank} onChange={e=>setBlank(e.target.value)} placeholder="Type the phrase" />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <PrimaryButton onClick={check}>Check answers</PrimaryButton>
          <button className="px-3 py-1.5 rounded-xl border" onClick={reset}>Reset</button>
        </div>

        {result && (
          <div className="mt-3 text-sm">
            <div>TF/NG: {result.tfOK ? '✅' : '❌'}</div>
            <div>Spot synonyms: {result.spotOK ? '✅' : '❌'}</div>
            <div>Paraphrase: {result.mcqOK ? '✅' : '❌'}</div>
            <div>Blank: {result.blankOK ? '✅' : '❌'}</div>
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
