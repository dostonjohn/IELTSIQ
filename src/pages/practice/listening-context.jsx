// src/pages/practice/listening-context.jsx
import React, { useRef, useState } from 'react';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { CONTEXT_ITEMS } from './context.data';

function normalize(s) {
  return (s || '').toLowerCase().trim().replace(/\s+/g, ' ');
}

function gradeKeywords(userInputs, answerGroups) {
  const gold = new Set(answerGroups.flat().map(normalize));
  const used = new Set();
  let correctCount = 0;
  const perInputCorrect = userInputs.map((raw) => {
    const v = normalize(raw);
    if (!v || used.has(v) || !gold.has(v)) return false;
    used.add(v);
    correctCount++;
    return true;
  });
  const canonical = answerGroups.map((g)=>g[0]);
  return { correctCount, perInputCorrect, canonical };
}

export default function ListeningContext() {
  const audioRefs = useRef({});
  const [activeId, setActiveId] = useState(null);
  const [openId, setOpenId] = useState(null);

  // per-item inputs & mcq
  const [inputs, setInputs] = useState({});  // { [id]: [a,b,c] }
  const [mcq, setMcq] = useState({});        // { [id]: selectedIndex|undefined }

  // modal result
  const [modalOpen, setModalOpen] = useState(false);
  const [result, setResult] = useState(null);

  const onPlay = (id) => {
    // pause previous
    if (activeId && activeId !== id) {
      const prev = audioRefs.current[activeId];
      if (prev && !prev.paused) prev.pause();
    }
    setActiveId(id);
    setOpenId(id);
  };

  const onTimeUpdate = (e) => {
    // auto-pause at 30s to simulate short clips
    if (e.currentTarget.currentTime >= 30) {
      e.currentTarget.pause();
    }
  };

  const updateInput = (id, idx, value) => {
    setInputs((st) => {
      const next = { ...st };
      const arr = next[id] ? [...next[id]] : ['', '', ''];
      arr[idx] = value;
      next[id] = arr;
      return next;
    });
  };

  const submit = (item) => {
    const u = (inputs[item.id] || ['', '', '']).map((s)=>s || '');
    const { correctCount, perInputCorrect, canonical } = gradeKeywords(u, item.keywords);
    const mcqCorrect = (mcq[item.id] === item.mcq.answerIndex);
    setResult({
      title: item.title,
      keywords: { user: u, perInputCorrect, correctCount, canonical },
      mcq: { selected: mcq[item.id], correct: mcqCorrect, correctText: item.mcq.options[item.mcq.answerIndex], options: item.mcq.options, question: item.mcq.question },
      script: item.script,
    });
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <Card title="Listening — Context">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Ten short audios (~30s). Play an audio to reveal its tasks: list three keywords in any order, then answer one multiple-choice question.
        </p>
      </Card>

      {CONTEXT_ITEMS.map((item) => (
        <Card key={item.id} title={item.title}>
          <section aria-label={item.title} className="space-y-3">
            <audio
              ref={(el) => (audioRefs.current[item.id] = el)}
              src={item.src}
              controls
              className="w-full"
              onPlay={() => onPlay(item.id)}
              onTimeUpdate={onTimeUpdate}
              onLoadedMetadata={() => { const a = audioRefs.current[item.id]; if (a) a.playbackRate = 1; }}
            />
            <div className="flex items-center justify-between">
              <button
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5"
                onClick={() => setOpenId((v)=> v===item.id ? null : item.id)}
                aria-expanded={openId===item.id}
              >
                {openId===item.id ? 'Hide tasks' : 'Show tasks'}
              </button>
              <div className="text-xs text-gray-500">Auto-pauses at 30s</div>
            </div>

            {openId === item.id && (
              <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3 space-y-3">
                {/* Task 1: three keywords, order-agnostic */}
                <div>
                  <div className="font-semibold mb-1">Task 1 — Three keywords (any order)</div>
                  <div className="grid sm:grid-cols-3 gap-2">
                    {[0,1,2].map((i)=>(
                      <input
                        key={i}
                        type="text"
                        className="px-2 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 w-full"
                        placeholder={`Keyword ${i+1}`}
                        value={(inputs[item.id]?.[i]) || ''}
                        onChange={(e)=>updateInput(item.id, i, e.target.value)}
                      />
                    ))}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">Tip: synonyms count too if listed in the answer set.</div>
                </div>

                {/* Task 2: MCQ */}
                <div>
                  <div className="font-semibold mb-1">Task 2 — One question</div>
                  <div className="text-sm mb-1">{item.mcq.question}</div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {item.mcq.options.map((opt, idx)=>(
                      <label key={idx} className="flex items-center gap-2 px-2 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5">
                        <input
                          type="radio"
                          name={`mcq-${item.id}`}
                          checked={mcq[item.id] === idx}
                          onChange={()=> setMcq((st)=>({...st, [item.id]: idx}))}
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    className="px-3 py-2 rounded-lg bg-indigo-600 text-white"
                    onClick={()=>submit(item)}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </section>
        </Card>
      ))}

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title="Results">
        {result && (
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-500">Audio</div>
              <div className="font-semibold">{result.title}</div>
            </div>

            <div>
              <div className="font-semibold mb-1">Keywords</div>
              <ul className="list-disc pl-5">
                {result.keywords.user.map((v, i)=>(
                  <li key={i}>
                    <span className={`${result.keywords.perInputCorrect[i] ? 'text-green-600' : 'text-red-600'}`}>
                      {v || <em className="text-gray-500">—</em>}
                    </span>
                    {!result.keywords.perInputCorrect[i] && (
                      <span className="text-gray-500"> (expected one of: {result.keywords.canonical.join(', ')})</span>
                    )}
                  </li>
                ))}
              </ul>
              <div className="text-sm mt-1">Score: {result.keywords.correctCount} / 3</div>
            </div>

            <div>
              <div className="font-semibold mb-1">MCQ</div>
              <div className="text-sm mb-1">{result.mcq.question}</div>
              <div className={`text-sm ${result.mcq.correct ? 'text-green-600' : 'text-red-600'}`}>
                {result.mcq.correct ? 'Correct' : `Wrong — Correct answer: ${result.mcq.correctText}`}
              </div>
            </div>

            <div>
              <div className="font-semibold mb-1">Transcript</div>
              <div className="text-sm whitespace-pre-line">{result.script}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
