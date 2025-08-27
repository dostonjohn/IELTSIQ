import React, { useRef, useState } from 'react';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import Modal from '../../components/Modal';
import { CONTEXT_ITEMS } from './context.data';

function normalize(s){ return (s||'').toLowerCase().trim().replace(/\s+/g,' '); }

function gradeKeywords(userInputs, answerGroups){
  const gold = new Set(answerGroups.flat().map(normalize));
  const used = new Set();
  let correctCount = 0;
  const perInputCorrect = userInputs.map(raw => {
    const v = normalize(raw);
    if(!v || used.has(v) || !gold.has(v)) return false;
    used.add(v); correctCount++; return true;
  });
  const canonical = answerGroups.map(g=>g[0]);
  return { correctCount, perInputCorrect, canonical };
}

export default function ListeningContext(){
  const audioRefs = useRef({});
  const [openId, setOpenId] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [inputs, setInputs] = useState({});   // {id: [a,b,c]}
  const [mcq, setMcq] = useState({});         // {id: index}
  const [result, setResult] = useState(null); // modal payload

  const onPlay = (id) => {
    // pause previous
    if(activeId && audioRefs.current[activeId] && !audioRefs.current[activeId].paused){
      audioRefs.current[activeId].pause();
    }
    setActiveId(id);
    setOpenId(id);
  };

  const handleSubmit = (item) => {
    const u = (inputs[item.id] || ['', '', '']).map(x=>x||'');
    const { correctCount, perInputCorrect, canonical } = gradeKeywords(u, item.keywords);
    const mcqCorrect = (mcq[item.id] === item.mcq.answerIndex);
    setResult({
      title: item.title,
      perInputCorrect,
      correctCount,
      mcqCorrect,
      mcqCorrectAnswer: item.mcq.options[item.mcq.answerIndex],
      canonical,
      script: item.script
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Listening — Context</h2>
        <a href="/practice/listening" className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">Back</a>
      </div>

      {CONTEXT_ITEMS.map(item => (
        <Card key={item.id} title={item.title}>
          <div className="space-y-3">
            <audio
              ref={el => audioRefs.current[item.id] = el}
              src={item.src}
              controls
              className="w-full"
              onTimeUpdate={(e)=>{ if(e.currentTarget.currentTime>=30) e.currentTarget.pause(); }}
              onPlay={()=>onPlay(item.id)}
            />
            <div className="flex items-center justify-end">
              <button
                onClick={()=>setOpenId(openId===item.id?null:item.id)}
                aria-expanded={openId===item.id}
                className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10"
              >
                {openId===item.id? 'Hide tasks' : 'Show tasks'}
              </button>
            </div>

            {openId===item.id && (
              <div className="space-y-3">
                {/* Task 1: keywords */}
                <div>
                  <div className="font-medium mb-1">Task 1 — Write 3 keywords</div>
                  <div className="grid sm:grid-cols-3 gap-2">
                    {[0,1,2].map(i=>(
                      <input key={i}
                        value={(inputs[item.id]?.[i])||''}
                        onChange={e=> setInputs(prev=>({ ...prev, [item.id]: Object.assign([ '', '', '' ], prev[item.id]||[], { [i]: e.target.value }) }))}
                        className="w-full rounded-xl border border-gray-200 dark:border-white/10 p-2 bg-white/80 dark:bg-white/5"
                        placeholder={`Keyword ${i+1}`}
                        aria-label={`Keyword ${i+1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Task 2: MCQ */}
                <div className="space-y-2">
                  <div className="font-medium mb-1">Task 2 — Multiple choice</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{item.mcq.question}</div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {item.mcq.options.map((opt, idx)=>(
                      <label key={idx} className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 p-2 cursor-pointer">
                        <input type="radio" name={`mcq-${item.id}`} checked={mcq[item.id]===idx}
                          onChange={()=> setMcq(prev=>({ ...prev, [item.id]: idx }))} />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <PrimaryButton onClick={()=>handleSubmit(item)}>Submit</PrimaryButton>
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}

      <Modal open={!!result} title={result?.title || 'Results'} onClose={()=>setResult(null)}>
        {result && (
          <div className="space-y-2">
            <div className="font-medium">Task 1 — Keywords</div>
            <ul className="text-sm list-disc pl-5">
              {result.perInputCorrect.map((ok,i)=>(
                <li key={i} className={ok? 'text-green-600' : 'text-red-600'}>
                  {ok? 'Correct' : 'Incorrect'}
                </li>
              ))}
            </ul>
            <div className="text-xs">Expected keywords: <strong>{result.canonical.join(', ')}</strong></div>

            <div className="font-medium mt-3">Task 2 — Multiple Choice</div>
            <div className="text-sm">{result.mcqCorrect? 'Correct' : <>Incorrect. Correct option: <strong>{result.mcqCorrectAnswer}</strong></>}</div>

            <div className="font-medium mt-3">Transcript</div>
            <pre className="text-xs whitespace-pre-wrap">{result.script}</pre>
          </div>
        )}
      </Modal>
    </div>
  );
}