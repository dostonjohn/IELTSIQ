
import React, { useState, useMemo } from 'react';
import Card from '../../../components/Card';
import PrimaryButton from '../../../components/PrimaryButton';
import { Link } from 'react-router-dom';
import manifest from '../../../data/readingParaphraseManifest.json';
import { inAccepted, selectMatchIsCorrect } from '../../../utils/readingParaphraseCheck';

function splitSentences(text){
  // very simple sentence splitter suitable for our crafted passages
  // keeps punctuation by splitting on .!? followed by space and capital or end
  const parts = [];
  let buf = '';
  for (let i=0;i<text.length;i++){
    const ch = text[i];
    buf += ch;
    if (/[.!?]/.test(ch)){
      // look ahead: end or space
      const next = text[i+1] || '';
      if (next === ' ' || next === '\n' || next === ''){
        parts.push(buf.trim());
        buf = '';
      }
    }
  }
  if (buf.trim()) parts.push(buf.trim());
  return parts;
}

export default function ParagraphMode(){
  const sets = manifest.paragraphMode;
  const [idx, setIdx] = useState(0);
  const item = sets[idx];

  const [tfng, setTfng] = useState({});
  const [spotText, setSpotText] = useState({});
  const [selections, setSelections] = useState({});
  const setSel = (key, val) => setSelections(s => ({...s, [key]: val}));
  const [result, setResult] = useState(null);

  const evidenceList = useMemo(() => (item.tasks.tfng || []).map(q => (q.evidence||'').toLowerCase()), [item]);
  const sentences = useMemo(() => splitSentences(item.paragraph), [item.paragraph]);

  const highlighted = useMemo(() => sentences.map((s, i) => {
    const should = evidenceList.some(ev => ev && s.toLowerCase().includes(ev));
    return (
      <span key={i} className={should ? 'bg-yellow-100/60 dark:bg-yellow-700/50 rounded px-1' : ''}>
        {s}{i < sentences.length-1 ? ' ' : ''}
      </span>
    );
  }), [sentences, evidenceList]);

  const check = ()=>{
    const tfOK = item.tasks.tfng.every((q, i)=> (tfng[i]||'').toLowerCase() === q.answer);
    const spotOK = item.tasks.spotSynonym.every((q,i)=> inAccepted(spotText[i]||'', q.accepted));
    const matchOK = selectMatchIsCorrect(item.tasks.matchSynonyms.answers, selections);
    setResult({tfOK, spotOK, matchOK});
  };
  const reset = ()=>{ setTfng({}); setSpotText({}); setSelections({}); setResult(null); };

  return (
    <div className="space-y-6">
      <div className="relative max-w-5xl mx-auto">
        <Link to="/practice/reading/paraphrase" className="absolute top-0 right-0">
          <button className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">Back</button>
        </Link>
        <h1 className="text-2xl font-semibold pr-28">Paragraph Mode</h1>
        <p className="text-gray-600 dark:text-gray-300">We highlight the sentence(s) that each TF/NG item paraphrases.</p>
      </div>

      <Card>
        <div className="prose dark:prose-invert max-w-none leading-relaxed">{highlighted}</div>

        <div className="mt-6 space-y-6">
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
                  <input className="mt-2 px-2 py-1 rounded border w-full" placeholder="Type the exact phrase from the paragraph" value={spotText[i]||''} onChange={e=>setSpotText(s=>({...s, [i]: e.target.value}))}/>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="font-medium">Match synonyms</div>
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
        </div>

        <div className="mt-6 flex gap-2">
          <PrimaryButton onClick={check}>Check answers</PrimaryButton>
          <button className="px-3 py-1.5 rounded-xl border" onClick={reset}>Reset</button>
        </div>

        {result && (
          <div className="mt-3 text-sm">
            <div>TF/NG: {result.tfOK ? '✅' : '❌'}</div>
            <div>Spot synonyms: {result.spotOK ? '✅' : '❌'}</div>
            <div>Match: {result.matchOK ? '✅' : '❌'}</div>
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
