
import React, { useEffect, useRef, useState } from 'react';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';

const SPEED_STEPS = [0.75, 1.0, 1.25, 1.5, 2.0];

const CLIP = {
  title: 'Speed Ladder Demo',
  src: '/audio/sample.wav',
  tasks: {
    mcq: {
      question: 'What is the clip mainly about?',
      options: ['City traffic', 'A museum tour', 'Campus library', 'Weather report', 'Morning workout'],
      answerIndex: 3
    },
    input: {
      question: 'One-word answer: What warning is mentioned?',
      answers: ['storm','storms']
    },
    order: {
      question: 'Put events in order:',
      items: ['Rain starts', 'Wind increases', 'Umbrellas open'],
      correctOrder: [0,1,2]
    },
    transcript: `Good morning. A quick update before your commute: a line of rain is moving across the city with
      gusty winds expected by mid-morning. Please allow a bit of extra time and keep an umbrella handy. We’ll check
      back at the top of the hour with more details on the storm track.`
  }
};

function normalize(s) {
  return (s || '').toLowerCase().trim().replace(/\s+/g,' ');
}

export default function ListeningSpeed() {
  const audioRef = useRef(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [playedPct, setPlayedPct] = useState(0);
  const [mcqChoice, setMcqChoice] = useState(null);
  const [inputAns, setInputAns] = useState('');
  const [orderSel, setOrderSel] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState(null);

  const speed = SPEED_STEPS[stepIdx];

  const onTimeUpdate = (e) => {
    const a = e.currentTarget;
    const dur = a.duration || 1;
    setPlayedPct(Math.min(100, (a.currentTime / dur) * 100));
    if (a.currentTime >= 30) a.pause();
  };

  const canAttemptTasks = playedPct >= 70;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
      setPlayedPct(0);
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
  }, [speed]);

  const startOver = () => {
    setStepIdx(0);
    setPlayedPct(0);
    setMcqChoice(null);
    setInputAns('');
    setOrderSel([]);
    setResult(null);
    setShowModal(false);
    if (audioRef.current) {
      audioRef.current.playbackRate = SPEED_STEPS[0];
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
  };

  const onSubmit = () => {
    const t = CLIP.tasks;
    const mcqCorrect = mcqChoice === t.mcq.answerIndex;
    const inputCorrect = (t.input.answers || []).map(normalize).includes(normalize(inputAns));
    const orderCorrect = JSON.stringify(orderSel) === JSON.stringify(t.order.correctOrder);

    setResult({
      mcqCorrect,
      inputCorrect,
      orderCorrect,
      correctMcq: t.mcq.options[t.mcq.answerIndex],
      correctInput: t.input.answers[0],
      correctOrder: t.order.items,
      transcript: t.transcript
    });
    setShowModal(true);
  };

  const toggleOrderItem = (idx) => {
    setOrderSel(prev => {
      if (prev.includes(idx)) return prev.filter(i => i!==idx);
      return [...prev, idx];
    });
  };

  const goFaster = () => {
    if (stepIdx < SPEED_STEPS.length - 1) setStepIdx(stepIdx + 1);
  };

  return (
    <div className="space-y-4">
      <Card title="Listening — Speed Ladder">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Same 30s clip at increasing speeds. Complete tasks after listening ~70%.
          </div>
          <div className="flex items-center gap-2">
            {SPEED_STEPS.map((s,i)=>(
              <button key={s}
                onClick={()=>setStepIdx(i)}
                className={`px-3 py-1.5 rounded-xl border text-sm ${i===stepIdx?'bg-indigo-600 text-white border-indigo-600':'bg-white/70 dark:bg-white/5 border-gray-200 dark:border-white/10'}`}>
                {s.toFixed(2)}×
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card title={`${CLIP.title} — ${speed.toFixed(2)}×`}>
        <audio
          ref={audioRef}
          src={CLIP.src}
          controls
          className="w-full"
          onLoadedMetadata={(e)=>{ e.currentTarget.playbackRate = speed; }}
          onPlay={(e)=>{ e.currentTarget.playbackRate = speed; }}
          onTimeUpdate={onTimeUpdate}
        />
        <div className="mt-2 h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500" style={{width: `${playedPct}%`}} />
        </div>

        <div className="mt-4 grid gap-3">
          <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3">
            <div className="font-medium mb-2">Task 1 — MCQ</div>
            <div className="text-sm mb-2">{CLIP.tasks.mcq.question}</div>
            <div className="grid sm:grid-cols-2 gap-2">
              {CLIP.tasks.mcq.options.map((opt, idx)=>(
                <label key={idx} className={`rounded-xl border p-2 cursor-pointer ${mcqChoice===idx?'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10':'border-gray-200 dark:border-white/10'}`}>
                  <input type="radio" name="mcq" className="mr-2" disabled={!canAttemptTasks}
                    checked={mcqChoice===idx} onChange={()=>setMcqChoice(idx)} />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3">
            <div className="font-medium mb-2">Task 2 — Short Answer</div>
            <div className="text-sm mb-2">{CLIP.tasks.input.question}</div>
            <input type="text" value={inputAns} disabled={!canAttemptTasks}
              onChange={(e)=>setInputAns(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 p-2 bg-white/70 dark:bg-white/5" placeholder="Type one word…"/>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3">
            <div className="font-medium mb-2">Task 3 — Order It</div>
            <div className="text-sm mb-2">{CLIP.tasks.order.question}</div>
            <div className="flex flex-wrap gap-2">
              {CLIP.tasks.order.items.map((it, idx)=>(
                <button key={idx} disabled={!canAttemptTasks}
                  onClick={()=>toggleOrderItem(idx)}
                  className={`px-3 py-1.5 rounded-xl border text-sm ${orderSel.includes(idx)?'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10':'border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5'}`}>
                  {it}
                </button>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500">Your order: {orderSel.map(i=>CLIP.tasks.order.items[i]).join(' → ') || '—'}</div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <PrimaryButton disabled={!canAttemptTasks} onClick={onSubmit}>Submit</PrimaryButton>
            <PrimaryButton onClick={goFaster} disabled={stepIdx===SPEED_STEPS.length-1}>Go Faster</PrimaryButton>
            <PrimaryButton onClick={startOver}>Restart Ladder</PrimaryButton>
          </div>
        </div>
      </Card>

      {showModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setShowModal(false)} />
          <div className="relative z-10 w-full max-w-xl rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-4">
            <div className="text-lg font-semibold mb-2">Results</div>
            <ul className="space-y-1 text-sm">
              <li>Task 1 (MCQ): {result.mcqCorrect ? '✅ Correct' : `❌ Incorrect — Correct: ${result.correctMcq}`}</li>
              <li>Task 2 (Short answer): {result.inputCorrect ? '✅ Correct' : `❌ Incorrect — Expected: ${result.correctInput}`}</li>
              <li>Task 3 (Order): {result.orderCorrect ? '✅ Correct' : `❌ Incorrect — Correct order: ${result.correctOrder.join(' → ')}`}</li>
            </ul>
            <div className="mt-3 text-sm whitespace-pre-wrap">
              <div className="font-medium mb-1">Transcript</div>
              {result.transcript}
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <PrimaryButton onClick={()=>setShowModal(false)}>Close</PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
