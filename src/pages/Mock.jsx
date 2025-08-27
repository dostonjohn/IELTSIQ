
import React, { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import TimerBadge from '../components/mock/TimerBadge';
// import MCQ from '../components/mock/MCQ'; // not used anymore after Reading embed
import Recorder from '../components/mock/Recorder';
import { ListeningEngine } from '../features/cdmock/listening';
import { listening, writing, speaking } from '../data/cdMockSample';
import { ReadingEngine } from '../features/cdmock/reading';

const SectionChip = ({active, onClick, children}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 rounded-xl text-sm border transition-colors ${
      active
        ? 'bg-indigo-600 text-white border-indigo-600'
        : 'bg-white/70 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10'
    }`}
  >
    {children}
  </button>
);

const SummaryRow = ({label, value}) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

export default function Mock(){
  const [tab, setTab] = useState('intro'); // intro, listening, reading, writing, speaking, review
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);

  // listening state
  const [lAnswers, setLAnswers] = useState(Array(listening.questions.length).fill(null));
  const [lScore, setLScore] = useState(null);

  // writing state
  const [w1, setW1] = useState('');
  const [w2, setW2] = useState('');

  // speaking state
  const [sBlobs, setSBlobs] = useState([]);

  useEffect(()=>{
    if(!running) return;
    const id = setInterval(()=>setTimer((t)=>t+1), 1000);
    return ()=>clearInterval(id);
  }, [running]);

  // Auto focus/fullscreen when entering Listening; undo when leaving
  useEffect(() => {
    if (tab === 'listening') {
      document.body.classList.add('is-reading-full');
      const el = document.documentElement;
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      }
    }
    return () => {
      if (tab === 'listening') {
        document.body.classList.remove('is-reading-full');
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };
  }, [tab]);

  const startSection = (name, seconds)=>(()=>{
    setTab(name);
    setTimer(0);
    setRunning(true);
  });

  const submitListening = ()=>{
    const correct = listening.questions.reduce((acc,q,i)=> acc + (lAnswers[i]===q.answer ? 1:0), 0);
    setLScore(`${correct} / ${listening.questions.length}`);
    setRunning(false);
    setTab('reading');
    setTimer(0);
  };

  const saveWriting = ()=>{
    setRunning(false);
    setTab('speaking');
    setTimer(0);
  };

  const finishExam = ()=>{
    setRunning(false);
    setTab('review');
  };

  const downloadText = (filename, text)=>{
    const blob = new Blob([text], {type:'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAudio = (blob, idx)=>{
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `speaking-part-${idx+1}.webm`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <SectionChip active={tab==='intro'} onClick={()=>setTab('intro')}>Intro</SectionChip>
            <SectionChip active={tab==='listening'} onClick={()=>setTab('listening')}>Listening</SectionChip>
            <SectionChip active={tab==='reading'} onClick={()=>setTab('reading')}>Reading</SectionChip>
            <SectionChip active={tab==='writing'} onClick={()=>setTab('writing')}>Writing</SectionChip>
            <SectionChip active={tab==='speaking'} onClick={()=>setTab('speaking')}>Speaking</SectionChip>
            <SectionChip active={tab==='review'} onClick={()=>setTab('review')}>Review</SectionChip>
          </div>
          <TimerBadge seconds={timer} />
        </div>
      </Card>

      {tab==='listening' && (
        <div className="listening-focus-wrap">
          <Card title="Listening — IELTSIQ Engine">
            <ListeningEngine slug="full-listening" />
          </Card>
        </div>
      )}

      {tab==='intro' && (
        <Card title="Full CD IELTS Mock">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            You will go through Listening, Reading, Writing and Speaking. Sections are timed locally and answers are saved in your browser.
          </p>
          <div className="mt-4 flex gap-2">
            <PrimaryButton onClick={startSection('listening')}>Start Listening</PrimaryButton>
          </div>
        </Card>
      )}

      {tab==='reading' && (<ReadingEngine />)}

      {tab==='writing' && (
        <Card title="Writing">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-semibold mb-1">Task 1</div>
              <div className="text-xs text-gray-500 mb-2">
                Write your answer below. The question is shown above the editor.
              </div>
              <div className="mb-2 rounded-lg border border-gray-200 dark:border-white/10 p-3 text-sm bg-white/70 dark:bg-white/5 whitespace-pre-wrap max-h-40 overflow-auto">
                {writing.task1}
              </div>
              <textarea
                value={w1}
                onChange={(e)=>setW1(e.target.value)}
                className="w-full min-h-[180px] rounded-xl border border-gray-200 dark:border-white/10 p-3 bg-white/80 dark:bg-white/5"
                placeholder="Start typing your Task 1 answer…"
                aria-label="Writing Task 1 answer"
              />
              <div className="mt-1 text-xs text-gray-500">Words: {w1.trim()? w1.trim().split(/\s+/).length: 0}</div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-1">Task 2</div>
              <div className="text-xs text-gray-500 mb-2">
                Write your answer below. The question is shown above the editor.
              </div>
              <div className="mb-2 rounded-lg border border-gray-200 dark:border-white/10 p-3 text-sm bg-white/70 dark:bg-white/5 whitespace-pre-wrap max-h-40 overflow-auto">
                {writing.task2}
              </div>
              <textarea
                value={w2}
                onChange={(e)=>setW2(e.target.value)}
                className="w-full min-h-[180px] rounded-xl border border-gray-200 dark:border-white/10 p-3 bg-white/80 dark:bg-white/5"
                placeholder="Start typing your Task 2 answer…"
                aria-label="Writing Task 2 answer"
              />
              <div className="mt-1 text-xs text-gray-500">Words: {w2.trim()? w2.trim().split(/\s+/).length: 0}</div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <PrimaryButton onClick={()=>{ downloadText('writing-task1.txt', w1); }}>Download Task 1</PrimaryButton>
            <PrimaryButton onClick={()=>{ downloadText('writing-task2.txt', w2); }}>Download Task 2</PrimaryButton>
            <PrimaryButton onClick={saveWriting}>Continue to Speaking</PrimaryButton>
          </div>
        </Card>
      )}

      {tab==='speaking' && (
        <Card title="Speaking">
          <div className="grid gap-3">
            <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3">
              <div className="font-semibold mb-1">Part 1</div>
              <ul className="list-disc pl-5 text-sm">
                {speaking.part1.map((q,i)=>(<li key={i}>{q}</li>))}
              </ul>
              <div className="mt-2">
                <Recorder onBlob={(b)=>setSBlobs((arr)=>{ const next=[...arr]; next[0]=b; return next; })} />
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3">
              <div className="font-semibold mb-1">Part 2 — Cue card</div>
              <div className="text-sm">{speaking.cueCard}</div>
              <div className="mt-2">
                <Recorder onBlob={(b)=>setSBlobs((arr)=>{ const next=[...arr]; next[1]=b; return next; })} />
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3">
              <div className="font-semibold mb-1">Part 3</div>
              <ul className="list-disc pl-5 text-sm">
                {speaking.part3.map((q,i)=>(<li key={i}>{q}</li>))}
              </ul>
              <div className="mt-2">
                <Recorder onBlob={(b)=>setSBlobs((arr)=>{ const next=[...arr]; next[2]=b; return next; })} />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-end gap-2">
              {sBlobs.map((b,i)=> b && <button key={i} onClick={()=>downloadAudio(b,i)} className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 dark:border-white/10">Download Part {i+1}</button>)}
              <PrimaryButton onClick={finishExam}>Finish & Review</PrimaryButton>
            </div>
          </div>
        </Card>
      )}

      {tab==='review' && (
        <Card title="Review">
          <div className="grid md:grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3">
              <SummaryRow label="Listening score" value={lScore ?? '—'} />
              <SummaryRow label="Reading" value="Shown inside the Reading page" />
              <SummaryRow label="Writing files" value={`${w1? 'Task 1 ' : ''}${w2? 'Task 2' : ''}` || '—'} />
              <SummaryRow label="Speaking recordings" value={`${sBlobs.filter(Boolean).length}`} />
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3 text-sm text-gray-600 dark:text-gray-300">
              <p>Great job! You can download your writing and speaking artifacts. Listening/Reading are auto-checked in this demo.</p>
              <p className="mt-2">
                To use real IELTS materials, replace the sample audio and questions in
                <code> src/data/cdMockSample.js</code> and <code> public/audio/</code>.
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-end">
            <PrimaryButton
              onClick={()=>{
                setTab('intro');
                setTimer(0);
                setRunning(false);
                setLAnswers(Array(listening.questions.length).fill(null));
                setLScore(null);
                setW1('');
                setW2('');
                setSBlobs([]);
              }}
            >
              Reset exam
            </PrimaryButton>
          </div>
        </Card>
      )}
    </div>
  );
}
