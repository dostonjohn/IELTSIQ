import React, { useEffect, useRef, useState } from 'react'
import { Keyboard } from 'lucide-react'
import Card from '../components/Card'
import PrimaryButton from '../components/PrimaryButton'
import TypingStream from '../components/Typing/TypingStream'
import TypingResultsModal from '../components/Typing/TypingResultsModal'
import { countWords, countChars, wpmFrom, countCorrectChars, buildPassage } from '../utils'

const Typing = () => {
  const DURATIONS = [
    { id: "free", label: "Free" },
    { id: 15, label: "15s" },
    { id: 30, label: "30s" },
    { id: 60, label: "1m" },
    { id: 120, label: "2m" },
  ];

  const [mode, setMode] = useState("free");
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [typed, setTyped] = useState("");
  const [target, setTarget] = useState(buildPassage());
  const [finalStats, setFinalStats] = useState(null);
  const [locked, setLocked] = useState(false);
  const [shake, setShake] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const typedRef = useRef("");
  const startedAtRef = useRef(null);
  const endAtRef = useRef(null);
  const rafIdRef = useRef(null);
  const lastStatsRef = useRef(null);

  const hiddenRef = useRef(null);
  const boxRef = useRef(null);

  const isTimed = mode !== "free";
  const focusInput = () => setTimeout(() => hiddenRef.current && hiddenRef.current.focus(), 0);

  useEffect(() => {
    if (!running || !isTimed) return;
    const tick = () => {
      const now = Date.now();
      const msLeft = Math.max(0, (endAtRef.current ?? now) - now);
      const secLeft = Math.ceil(msLeft / 1000);
      setRemaining((prev) => (prev !== secLeft ? secLeft : prev));
      if (msLeft <= 0) {
        cancelAnimationFrame(rafIdRef.current);
        finalize({ elapsedMs: Number(mode) * 1000 });
        return;
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };
    rafIdRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafIdRef.current);
  }, [running, isTimed, mode]);

  const prettyTime = (sec) => {
    const total = Math.max(0, Math.round(Number(sec || 0)));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const beginRun = () => {
    const durMs = Number(mode) * 1000;
    const now = Date.now();
    startedAtRef.current = now;
    endAtRef.current = now + durMs;
    setRemaining(Math.ceil(durMs / 1000));
    setRunning(true);
  };

  const computeStats = (elapsedMs) => {
    const t = typedRef.current || "";
    const elapsed = typeof elapsedMs === 'number' ? elapsedMs : (startedAtRef.current ? Date.now() - startedAtRef.current : 0);
    const correct = countCorrectChars(target, t);
    return {
      wpm: wpmFrom(correct, elapsed),
      words: countWords(t),
      chars: countChars(t),
    };
  };

  const finalize = ({ elapsedMs } = {}) => {
    if (!isTimed || locked) return;
    setRunning(false);
    setLocked(true);
    const stats = computeStats(elapsedMs);
    lastStatsRef.current = stats;
    setFinalStats(stats);
    setShowModal(true);
  };

  const reset = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    setRunning(false);
    setRemaining(0);
    setTyped("");
    typedRef.current = "";
    setFinalStats(null);
    setTarget(buildPassage());
    setLocked(false);
    setShowModal(false);
    startedAtRef.current = null;
    endAtRef.current = null;
    focusInput();
  };

  const nudge = () => {
    setShake(true);
    setTimeout(() => setShake(false), 300);
  };

  const onType = (e) => {
    const v = e.target.value;
    if (isTimed && locked) { nudge(); return; }
    if (!running && isTimed) { beginRun(); }
    setTyped(v);
    typedRef.current = v;
    boxRef.current?.scrollIntoView({ block: "nearest" });
  };

  const Chip = ({ id, label }) => {
    const active = String(mode) === String(id);
    return (
      <button
        type="button"
        onClick={() => !running && setMode(id)}
        className={`px-3 py-1.5 rounded-xl text-sm border transition-colors ${active ? "bg-indigo-600 text-white border-indigo-600" : "bg-white/70 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"} ${running && isTimed ? "opacity-60 cursor-not-allowed" : ""}`}
        title={running && isTimed ? "Stop or reset to change duration" : undefined}
      >
        {label}
      </button>
    );
  };

  const statsForModal = finalStats || lastStatsRef.current;

  return (
    <Card
      title={<div className="flex items-center gap-2"><Keyboard size={16} /><span>Typing practice</span></div>}
      action={<div className="flex items-center gap-2">{DURATIONS.map(d => <Chip key={d.id} id={d.id} label={d.label} />)}</div>}
    >
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 text-sm tabular-nums">
          {isTimed ? (running ? `Time left: ${prettyTime(remaining)}` : `Duration: ${prettyTime(Number(mode))}`) : "Free mode"}
        </div>
        <PrimaryButton as="button" onClick={reset}>Reset</PrimaryButton>
      </div>

      <div className="relative" onClick={focusInput}>
        <textarea ref={hiddenRef} value={typed} onChange={onType} className="absolute -top-[9999px] -left-[9999px] w-px h-px opacity-0" spellCheck={false} readOnly={isTimed && locked} />
        <div ref={boxRef} className="cursor-text" role="textbox" aria-label="Typing area">
          <TypingStream target={target} typed={typed} shake={shake} />
        </div>
        <p className="mt-2 text-xs text-gray-500">Click the text to focus. Start typing to begin. Backspace is allowed.</p>
      </div>

      <TypingResultsModal open={isTimed && showModal} onClose={() => setShowModal(false)} stats={statsForModal} />
    </Card>
  )
}

export default Typing
