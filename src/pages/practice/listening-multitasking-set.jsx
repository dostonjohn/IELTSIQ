import React, { useEffect, useMemo, useRef, useState } from 'react';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import MultiTimerBar from '../../components/listening/MultiTimerBar';
import MultiResultModal from '../../components/listening/MultiResultModal';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import manifest from '../../data/multitaskingManifest.json';
import { checkAnswer } from '../../utils/multiAnswerCheck';

function useAudioProgress(audioRef, playing) {
  const [time, setTime] = useState(0);
  useEffect(()=>{
    const el = audioRef.current;
    if(!el) return;
    const onTime = () => setTime(el.currentTime || 0);
    el.addEventListener('timeupdate', onTime);
    return () => el.removeEventListener('timeupdate', onTime);
  }, [audioRef]);
  useEffect(()=>{
    const el = audioRef.current;
    if(!el) return;
    if (playing) el.play().catch(()=>{});
    else el.pause();
  }, [playing, audioRef]);
  return time;
}

export default function ListeningMultitaskingSet(){
  const { setId } = useParams();
  const [searchParams] = useSearchParams();
  const stage = Number(searchParams.get('stage') || 1);
  const data = useMemo(()=> manifest.sets.find(s => s.id === setId) || manifest.sets[0], [setId]);
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const time = useAudioProgress(audioRef, playing);
  const [unlocked, setUnlocked] = useState({}); // qid -> true
  const [locked, setLocked] = useState({}); // qid -> true when closed
  const [answers, setAnswers] = useState({}); // qid -> value
  const [msLeft, setMsLeft] = useState(0);
  const [activeQ, setActiveQ] = useState(null);
  const [showRes, setShowRes] = useState(false);
  const [results, setResults] = useState([]);

  // unlock logic
  useEffect(()=>{
    const q = data.questions.find(q => time >= q.cueTime - 0.05 && !unlocked[q.id] && !locked[q.id]);
    if(!q) return;
    setUnlocked(prev => ({ ...prev, [q.id]: true }));
    setActiveQ(q.id);
    if (stage === 1) {
      // pause and wait for user to continue
      setPlaying(false);
    } else {
      const total = stage === 2 ? manifest.defaults.bufferMsStage2 : manifest.defaults.bufferMsStage3;
      setMsLeft(total);
    }
  }, [time, data, unlocked, locked, stage]);

  // countdown for stage 2-3
  useEffect(()=>{
    if (stage === 1 || !activeQ) return;
    const total = stage === 2 ? manifest.defaults.bufferMsStage2 : manifest.defaults.bufferMsStage3;
    let t = total;
    setMsLeft(t);
    const id = setInterval(()=>{
      t -= 100;
      setMsLeft(t);
      if (t <= 0) {
        clearInterval(id);
        setLocked(prev => ({ ...prev, [activeQ]: true }));
        setActiveQ(null);
      }
    }, 100);
    return ()=> clearInterval(id);
  }, [activeQ, stage]);

  function onChange(qid, v) {
    setAnswers(prev => ({ ...prev, [qid]: v }));
  }

  function onContinue() {
    if (!activeQ) return;
    setLocked(prev => ({ ...prev, [activeQ]: true }));
    setActiveQ(null);
    setPlaying(true);
  }

  function onReplay(){
    if (stage === 3) return;
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = 0;
    setUnlocked({});
    setLocked({});
    setAnswers({});
    setActiveQ(null);
    setPlaying(false);
  }

  function onFinish(){
    const r = data.questions.map(q => checkAnswer(q, answers[q.id]));
    setResults(r);
    setShowRes(true);
  }

  const allLocked = data.questions.every(q => locked[q.id]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Multitasking — {data.title}</h2>
        <Link to="/practice/listening/multitasking">
          <button className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">Stages</button>
        </Link>
      </div>

      <Card title={"Audio" + (stage===3 ? " (no replay)" : "")}>
        <div className="flex items-center gap-3">
          <audio ref={audioRef} src={data.audio} controls className="w-full" />
          <button onClick={()=>setPlaying(p=>!p)} className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">
            {playing ? 'Pause' : 'Play'}
          </button>
          <button disabled={stage===3} onClick={onReplay} className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 disabled:opacity-50">Replay</button>
        </div>
        {stage!==1 && activeQ && (
          <div className="mt-3">
            <MultiTimerBar
              msLeft={msLeft}
              msTotal={stage===2 ? manifest.defaults.bufferMsStage2 : manifest.defaults.bufferMsStage3}
            />
          </div>
        )}
        {stage===1 && activeQ && (
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
            Audio paused — type your answer and press Continue.
          </div>
        )}
      </Card>

      <Card title="Questions (unlock when you reach the cue)">
        <div className="space-y-3">
          {data.questions.map((q, idx)=>{
            const isUnlocked = !!unlocked[q.id];
            const isLocked = !!locked[q.id];
            const status = isLocked ? 'Locked' : (isUnlocked ? 'Answer now' : 'Waiting for cue');

            // ✅ safe computed class (no quotes around the expression)
            const cardClass = `rounded-xl border p-3 ${
              activeQ === q.id
                ? "border-emerald-500 ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                : (isUnlocked && !isLocked)
                ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20"
                : "border-gray-200 dark:border-white/10"
            }`;

            return (
              <div key={q.id} className={cardClass}>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Q{idx+1}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">{status}</div>
                </div>
                <div className="mt-1 text-sm">{q.display}</div>

                {/* Inputs */}
                <div className="mt-2">
                  {q.type !== 'tf' ? (
                    <input
                      aria-label={"Answer for question " + (idx+1)}
                      disabled={!isUnlocked || isLocked}
                      value={answers[q.id] || ''}
                      onChange={(e)=>onChange(q.id, e.target.value)}
                      placeholder={q.type==='gap' ? 'Fill the missing word' : 'Type short answer'}
                      className="w-full rounded-xl border border-gray-200 dark:border-white/10 p-2 bg-white/80 dark:bg-white/5"
                    />
                  ) : (
                    <input
                      aria-label={"Type true or false for question " + (idx+1)}
                      disabled={!isUnlocked || isLocked}
                      value={answers[q.id] || ''}
                      onChange={(e)=>onChange(q.id, e.target.value)}
                      placeholder="Type true or false"
                      className="w-full rounded-xl border border-gray-200 dark:border-white/10 p-2 bg-white/80 dark:bg-white/5"
                    />
                  )}
                </div>

                {/* Stage 1 continue button */}
                {stage===1 && activeQ===q.id && (
                  <div className="mt-2 flex justify-end">
                    <PrimaryButton onClick={onContinue}>Continue</PrimaryButton>
                  </div>
                )}

                {/* Stage 2-3 timer bar already above */}
              </div>
            )
          })}
        </div>
      </Card>

      <div className="flex items-center justify-end gap-2">
        <button onClick={()=>window.history.back()} className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">Back</button>
        <PrimaryButton onClick={onFinish} disabled={!allLocked}>Finish</PrimaryButton>
      </div>

      <MultiResultModal
        open={showRes}
        onClose={()=>setShowRes(false)}
        results={results}
        total={data.questions.length}
        transcript={data.transcript}
      />
    </div>
  );
}
