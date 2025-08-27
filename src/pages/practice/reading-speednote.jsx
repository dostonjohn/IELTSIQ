
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import Modal from '../../components/Modal';
import manifest from '../../data/readingSpeedNoteManifest.json';

const SEC = 1000;

function tokenizePassage(passage) {
  // Split into words and non-words so punctuation doesn't block pins
  const raw = passage.match(/([A-Za-z0-9]+|[^A-Za-z0-9]+)/g) || [];
  return raw.map((t, i) => ({ id: i, text: t }));
}

function normalize(s='') {
  return s.toLowerCase().trim().replace(/\s+/g, ' ');
}

function isWordToken(t) {
  return /^[A-Za-z0-9]+$/.test(t);
}

export default function ReadingSpeedNote() {
  const defaults = manifest.defaults || { firstGlanceSeconds: 45, peekDuration: 10, pinLimit: 3 };
  const [setIdx, setSetIdx] = useState(0);
  const set = manifest.sets[setIdx];
  const [stage, setStage] = useState('read'); // 'read' | 'questions'
  const [countdown, setCountdown] = useState(defaults.firstGlanceSeconds);
  const [pins, setPins] = useState([]);       // array of strings (max 3)
  const [peekUsed, setPeekUsed] = useState(false);
  const [showPeek, setShowPeek] = useState(false);
  const [peekCountdown, setPeekCountdown] = useState(defaults.peekDuration);
  const [answers, setAnswers] = useState({}); // { qid: value }
  const [resultOpen, setResultOpen] = useState(false);
  const [breakdown, setBreakdown] = useState([]);
  const [score, setScore] = useState(0);

  const tokens = useMemo(() => tokenizePassage(set.passage), [set.passage]);

  // First glance timer (45s)
  useEffect(() => {
    if (stage !== 'read') return;
    if (countdown <= 0) { setStage('questions'); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), SEC);
    return () => clearTimeout(t);
  }, [stage, countdown]);

  // Peek timer (10s) once
  useEffect(() => {
    if (!showPeek) return;
    if (peekCountdown <= 0) { setShowPeek(false); return; }
    const t = setTimeout(() => setPeekCountdown(c => c - 1), SEC);
    return () => clearTimeout(t);
  }, [showPeek, peekCountdown]);

  function togglePin(word) {
    if (!isWordToken(word)) return;
    if (stage !== 'read') return;
    if (pins.includes(word)) {
      setPins(pins.filter(w => w !== word));
      return;
    }
    if (pins.length >= (defaults.pinLimit || 3)) return;
    setPins([...pins, word]);
  }

  function startQuestionsEarly() {
    if (stage === 'read') setStage('questions');
  }

  function usePeek() {
    if (peekUsed || stage !== 'questions') return;
    setPeekUsed(true);
    setPeekCountdown(defaults.peekDuration || 10);
    setShowPeek(true);
  }

  function onAnswer(qid, value) {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  }

  function checkAnswers() {
    const items = set.questions;
    let sc = 0;
    const br = items.map(q => {
      let correct = false;
      let expected = '';
      let user = answers[q.id];
      if (q.type === 'mcq') {
        expected = q.options[q.answerIndex];
        correct = (Number(user) === q.answerIndex);
        user = (user != null) ? q.options[Number(user)] : '';
      } else if (q.type === 'tfng') {
        expected = q.answer;
        correct = normalize(user) === normalize(q.answer);
      } else if (q.type === 'short') {
        expected = Array.isArray(q.answers) ? q.answers[0] : '';
        const pool = (q.answers || []).map(normalize);
        correct = pool.includes(normalize(String(user||'')));
      }
      if (correct) sc += 1;
      return { q, correct, expected, user: user || '', evidence: q.evidence?.text || '' };
    });
    setBreakdown(br);
    setScore(sc);
    setResultOpen(true);
  }

  
  function nextSet() {
    const next = (setIdx + 1) % manifest.sets.length;
    setSetIdx(next);
    // reset state
    setStage('read');
    setCountdown(defaults.firstGlanceSeconds || 45);
    setPins([]);
    setPeekUsed(false);
    setShowPeek(false);
    setPeekCountdown(defaults.peekDuration || 10);
    setAnswers({});
    setBreakdown([]);
    setScore(0);
    setResultOpen(false);
  }


  // Render helpers
  function PassageView({ clickable=true }) {
    return (
      <div className="leading-relaxed text-[15px] select-none">
        {tokens.map(tok => {
          if (tok.text.trim() === '') return <span key={tok.id}>{tok.text}</span>;
          const isPinAllowed = clickable && isWordToken(tok.text);
          const isPinned = pins.includes(tok.text);
          return (
            <span
              key={tok.id}
              onClick={() => { if (isPinAllowed) togglePin(tok.text); }}
              className={
                (isPinAllowed ? 'cursor-pointer ' : '') +
                (isPinned ? 'bg-yellow-200 dark:bg-yellow-600/40 rounded px-0.5' : '')
              }
            >
              {tok.text}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Reading Speed &amp; Note</h2>
        <button onClick={nextSet} className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">
          Next passage
        </button>
      </div>

      <Card title={set.title}>
        {stage === 'read' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                First glance ends in <span className="font-semibold">{countdown}s</span>. Pin up to <span className="font-semibold">{defaults.pinLimit}</span> words.
              </div>
              <button onClick={startQuestionsEarly} className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-white/10">
                Show questions now
              </button>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3">
              <PassageView clickable />
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Tap individual words or numbers to pin them. Pinned words will remain on the question screen.
            </div>
            <div className="text-sm">
              📌 Pinned: {pins.length > 0 ? pins.join(' · ') : <span className="text-gray-500">none</span>}
            </div>
          </div>
        )}

        {stage === 'questions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm">📌 Pinned words: {pins.length ? pins.join(' · ') : <span className="text-gray-500">none</span>}</div>
              <button
                onClick={usePeek}
                disabled={peekUsed}
                className={"px-3 py-1.5 rounded-xl border " + (peekUsed ? "opacity-50 cursor-not-allowed" : "hover:bg-black/5 dark:hover:bg-white/10")}
              >
                Quick Peek ({defaults.peekDuration}s)
              </button>
            </div>

            {/* Questions */}
            <div className="space-y-3">
              {set.questions.map((q, idx) => (
                <div key={q.id} className="rounded-xl border border-gray-200 dark:border-white/10 p-3 space-y-2">
                  <div className="font-medium">Q{idx+1}. {q.question || q.statement || q.prompt}</div>
                  {q.type === 'mcq' && (
                    <div className="grid gap-2">
                      {q.options.map((opt, oi) => (
                        <label key={oi} className="flex items-start gap-2">
                          <input type="radio" name={q.id} value={oi} onChange={e => onAnswer(q.id, Number(e.target.value))} />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {q.type === 'tfng' && (
                    <div className="grid grid-cols-3 gap-2">
                      {['true','false','not given'].map(v => (
                        <label key={v} className="flex items-center gap-2">
                          <input type="radio" name={q.id} value={v} onChange={e => onAnswer(q.id, e.target.value)} />
                          <span className="uppercase text-xs">{v}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {q.type === 'short' && (
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent"
                      placeholder="Type your answer"
                      onChange={e => onAnswer(q.id, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <PrimaryButton onClick={checkAnswers}>Submit</PrimaryButton>
            </div>
          </div>
        )}
      </Card>

      {/* Peek overlay */}
      {showPeek && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" aria-hidden />
          <div className="relative max-w-2xl w-full rounded-2xl border border-white/10 bg-white dark:bg-black p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold">Quick Peek · {peekCountdown}s</div>
              <div className="text-xs text-gray-500">read‑only</div>
            </div>
            <div className="prose max-w-none pointer-events-none select-none">
              <PassageView clickable={false} />
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <Modal open={resultOpen} onClose={() => setResultOpen(false)} title="Results">
        <div className="space-y-3">
          <div className="text-base font-semibold">You got {score} / {set.questions.length}</div>
          {peekUsed && <div className="text-xs text-gray-500">Quick Peek used · {defaults.peekDuration}s</div>}
          <div className="divide-y divide-gray-200 dark:divide-white/10">
            {breakdown.map((b, i) => (
              <div key={i} className="py-2 space-y-1">
                <div className={"font-medium " + (b.correct ? "text-green-600" : "text-red-600")}>
                  {b.correct ? "✅" : "❌"} Q{i+1}
                </div>
                <div className="text-sm"><span className="opacity-70">Your answer:</span> {b.user || <i>blank</i>}</div>
                <div className="text-sm"><span className="opacity-70">Correct:</span> {b.expected}</div>
                {b.evidence && (
                  <div className="text-xs mt-1 p-2 rounded-lg bg-gray-50 dark:bg-white/5">
                    <span className="opacity-70">Where in text:</span> “{b.evidence}”
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setResultOpen(false)} className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">Close</button>
            <PrimaryButton onClick={nextSet}>Try another passage</PrimaryButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
