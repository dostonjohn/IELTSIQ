import React, { useRef, useState } from 'react';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import Modal from '../../components/Modal';
import { ACCENT_OPTIONS, ACCENT_GROUPS } from './accents.data';

function normalize(s){ return (s||'').toLowerCase().trim().replace(/\s+/g,' '); }

export default function ListeningAccents(){
  const audioRefs = useRef({});
  const [activeId, setActiveId] = useState(null);
  const [openKey, setOpenKey] = useState(null);  // groupId-idx
  const [answers, setAnswers] = useState({});    // {key: {mcq:number, task2:'', task3:''}}
  const [result, setResult] = useState(null);

  const onPlay = (key) => {
    if(activeId && audioRefs.current[activeId] && !audioRefs.current[activeId].paused){
      audioRefs.current[activeId].pause();
    }
    setActiveId(key);
    setOpenKey(key);
  };

  const handleSubmit = (clipKey, clip, group) => {
    const a = answers[clipKey] || {};
    const mcqCorrect = a.mcq === clip.mcq.answerIndex;
    const task2ok = (clip.task2?.answer||[]).map(normalize).includes(normalize(a.task2));
    const task3ok = (clip.task3?.keyword||[]).map(normalize).includes(normalize(a.task3));
    setResult({
      title: `${group.name} — ${clip.title}`,
      mcqCorrect,
      mcqCorrectAnswer: clip.mcq.options[clip.mcq.answerIndex],
      task2ok,
      task2Answer: clip.task2?.answer?.[0] || '',
      task3ok,
      task3Keyword: clip.task3?.keyword?.[0] || '',
      script: clip.script
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Listening — Accents</h2>
        <a href="/practice/listening" className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">Back</a>
      </div>

      {ACCENT_GROUPS.map(group => (
        <Card key={group.id} title={group.name}>
          <div className="grid md:grid-cols-[260px_1fr] gap-3 items-start">
            <img src={group.cover} alt="" className="w-full h-44 md:h-48 object-cover rounded-xl border border-gray-200 dark:border-white/10" />
            <div className="space-y-2 w-full">
              {group.clips.map((clip, idx) => {
                const key = `${group.id}-${idx}`;
                const val = answers[key] || {};
                return (
                  <div key={key} className="rounded-xl border border-gray-200 dark:border-white/10 p-3 space-y-2">
                    <div className="font-medium">{clip.title}</div>
                    <audio
                      ref={el => audioRefs.current[key] = el}
                      src={clip.src}
                      controls
                      className="w-full"
                      onTimeUpdate={(e)=>{ if(e.currentTarget.currentTime>=30) e.currentTarget.pause(); }}
                      onPlay={()=>onPlay(key)}
                    />
                    <div className="flex items-center justify-end">
                      <button
                        onClick={()=> setOpenKey(openKey===key? null : key)}
                        className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10"
                        aria-expanded={openKey===key}
                      >
                        {openKey===key? 'Hide tasks' : 'Show tasks'}
                      </button>
                    </div>

                    {openKey===key && (
                      <div className="space-y-3">
                        {/* Task1: MCQ */}
                        <div className="space-y-2">
                          <div className="font-medium">Task 1 — Multiple choice</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">{clip.mcq.question}</div>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {clip.mcq.options.map((opt,i)=>(
                              <label key={i} className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 p-2 cursor-pointer">
                                <input type="radio" name={`mcq-${key}`} checked={val.mcq===i} onChange={()=> setAnswers(prev=>({ ...prev, [key]: { ...prev[key], mcq: i } }))} />
                                <span className="text-sm">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Task2: one-word input */}
                        <div>
                          <div className="font-medium mb-1">Task 2 — One-word answer</div>
                          <input
                            value={val.task2 || ''}
                            onChange={(e)=> setAnswers(prev=>({ ...prev, [key]: { ...prev[key], task2: e.target.value } }))}
                            className="w-full rounded-xl border border-gray-200 dark:border-white/10 p-2 bg-white/80 dark:bg-white/5"
                            placeholder="Type one word…"
                            aria-label="Task 2 answer"
                          />
                        </div>

                        {/* Task3: keyword */}
                        <div>
                          <div className="font-medium mb-1">Task 3 — Keyword</div>
                          <input
                            value={val.task3 || ''}
                            onChange={(e)=> setAnswers(prev=>({ ...prev, [key]: { ...prev[key], task3: e.target.value } }))}
                            className="w-full rounded-xl border border-gray-200 dark:border-white/10 p-2 bg-white/80 dark:bg-white/5"
                            placeholder="Type one keyword…"
                            aria-label="Task 3 keyword"
                          />
                        </div>

                        <div className="flex items-center justify-end">
                          <PrimaryButton onClick={()=>handleSubmit(key, clip, group)}>Submit</PrimaryButton>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
      </Card>
      ))}

      <Modal open={!!result} title={result?.title || 'Results'} onClose={()=>setResult(null)}>
        {result && (
          <div className="space-y-2">
            <div className="font-medium">Task 1 — Multiple choice</div>
            <div className="text-sm">{result.mcqCorrect? 'Correct' : <>Incorrect. Correct option: <strong>{result.mcqCorrectAnswer}</strong></>}</div>

            <div className="font-medium mt-3">Task 2 — One-word answer</div>
            <div className="text-sm">{result.task2ok? 'Correct' : <>Incorrect. Expected: <strong>{result.task2Answer}</strong></>}</div>

            <div className="font-medium mt-3">Task 3 — Keyword</div>
            <div className="text-sm">{result.task3ok? 'Correct' : <>Consider: <strong>{result.task3Keyword}</strong></>}</div>

            <div className="font-medium mt-3">Transcript</div>
            <pre className="text-xs whitespace-pre-wrap">{result.script}</pre>
          </div>
        )}
      </Modal>
    </div>
  );
}