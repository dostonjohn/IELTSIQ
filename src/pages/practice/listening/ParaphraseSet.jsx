import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../../components/Card';
import PrimaryButton from '../../../components/PrimaryButton';
import Modal from '../../../components/Modal';
import manifest from '../../../data/paraphraseManifest.json';

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function ParaphraseSet() {
  const { setId } = useParams();
  const data = manifest.sets.find(s => s.id === setId);
  const audioRef = useRef(null);
  const [playedRatio, setPlayedRatio] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  // visually lock tasks until audio ≥ 70%
  const lockClass = !unlocked ? 'opacity-60 pointer-events-none select-none' : '';

  // Task 1 state
  const [slots, setSlots] = useState({ 1: null, 2: null, 3: null });
  const [dragging, setDragging] = useState(null);
  const [t1Submitted, setT1Submitted] = useState(false);
  const [t1Results, setT1Results] = useState({});

  // Task 2 state
  const initialOrder = useMemo(() => (data ? shuffle(data.task2.paraphrasesInOrder) : []), [data]);
  const [seq, setSeq] = useState(initialOrder);
  const [t2Submitted, setT2Submitted] = useState(false);
  const [t2Correct, setT2Correct] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => {
      if (el.duration) {
        const r = el.currentTime / el.duration;
        setPlayedRatio(r);
        if (r >= 0.7) setUnlocked(true);
      }
    };
    el.addEventListener('timeupdate', onTime);
    return () => el.removeEventListener('timeupdate', onTime);
  }, []);

  if (!data) {
    return (
      <div className="p-4">
        Set not found.{' '}
        <Link className="text-blue-600 underline" to="/practice/listening/paraphrase">
          Back
        </Link>
      </div>
    );
  }

  const options = data.task1.options;

  function onDragStart(opt) {
    setDragging(opt);
  }
  function onDrop(slotIdx) {
    if (!dragging) return;
    setSlots(prev => {
      const next = { ...prev };
      // ensure an option is used only once
      for (const k of Object.keys(next)) {
        if (next[k] && next[k].label === dragging.label) next[k] = null;
      }
      next[slotIdx] = dragging;
      return next;
    });
    setDragging(null);
  }
  function removeFromSlot(slotIdx) {
    setSlots(prev => ({ ...prev, [slotIdx]: null }));
  }

  function submitT1() {
    const res = {};
    for (const i of [1, 2, 3]) {
      const chosen = slots[i];
      const ok = chosen && chosen.correctFor === i;
      res[i] = {
        chosen: chosen ? chosen.label : null,
        correct: ok,
        correctAnswer: options.find(o => o.correctFor === i)?.label
      };
    }
    setT1Results(res);
    setT1Submitted(true);
  }

  function moveUp(idx) {
    if (idx === 0) return;
    setSeq(prev => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }
  function moveDown(idx) {
    if (idx === seq.length - 1) return;
    setSeq(prev => {
      const next = [...prev];
      [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
      return next;
    });
  }

  function submitT2() {
    const ok = JSON.stringify(seq) === JSON.stringify(data.task2.paraphrasesInOrder);
    setT2Correct(ok);
    setT2Submitted(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{data.title}</h1>
        <Link to="/practice/listening/paraphrase" className="text-blue-600 underline">
          Change set
        </Link>
      </div>

      <Card>
        <div className="flex items-center gap-4">
          <audio ref={audioRef} controls className="w-full" src={data.audio} />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Play at least 70% of the audio to unlock tasks. Progress: {(playedRatio * 100).toFixed(0)}%
        </p>
        {!unlocked && (
          <div className="mt-2 text-xs text-gray-500">
            Tip: replace files in <code>/public/paraphrase/</code> with your real audio if needed.
          </div>
        )}
      </Card>

      {/* Task 1 */}
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Task 1 · Match paraphrases</h2>
          <div className="text-sm text-gray-500">Drag options A–E into slots 1–3</div>
        </div>

        <div className={`mt-4 grid md:grid-cols-2 gap-6 ${lockClass}`}>
          {/* Left: slots */}
          <div>
            {[1, 2, 3].map(i => (
              <div
                key={i}
                onDragOver={e => e.preventDefault()}
                onDrop={() => onDrop(i)}
                className="border rounded-xl p-3 mb-3 bg-white dark:bg-neutral-800 min-h-[60px] flex items-center justify-between text-gray-900 dark:text-gray-100"
              >
                <div className="font-medium mr-2">{i}.</div>
                <div className="flex-1 text-sm">
                  {slots[i] ? (
                    <span>
                      {slots[i].label}) {slots[i].text}
                    </span>
                  ) : (
                    <span className="text-gray-400">Drop option here</span>
                  )}
                </div>
                {slots[i] && (
                  <button
                    onClick={() => removeFromSlot(i)}
                    className="text-xs text-gray-500 underline ml-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            ))}
            <div className="mt-2">
              <PrimaryButton onClick={submitT1} disabled={!unlocked}>
                Submit Task 1
              </PrimaryButton>
            </div>
          </div>

          {/* Right: options */}
          <div className="rounded-xl p-3 bg-gray-50 dark:bg-neutral-900">
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Options</div>
            <div className="space-y-2">
              {options.map(opt => (
                <div
                  key={opt.label}
                  draggable
                  onDragStart={() => onDragStart(opt)}
                  className="border rounded-lg p-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 cursor-move"
                >
                  <span className="font-medium mr-2">{opt.label})</span>
                  <span className="text-sm">{opt.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Task 1 Result */}
      <Modal open={t1Submitted} onClose={() => setT1Submitted(false)} title="Task 1 feedback">
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="text-sm">
              <span className="font-medium">Slot {i}:</span>{' '}
              {t1Results[i]?.correct ? (
                <span className="text-green-600">Correct</span>
              ) : (
                <span className="text-red-600">Incorrect</span>
              )}{' '}
              {t1Results[i]?.chosen ? `(you chose ${t1Results[i]?.chosen})` : `(no answer)`}
              {!t1Results[i]?.correct && (
                <span className="ml-2 text-gray-600">Correct: {t1Results[i]?.correctAnswer}</span>
              )}
            </div>
          ))}
        </div>
      </Modal>

      {/* Task 2 */}
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Task 2 · Order the paraphrased sentences</h2>
          <div className="text-sm text-gray-500">Arrange top to bottom as they occurred</div>
        </div>
        <div className={`mt-4 space-y-2 ${lockClass}`}>
          {seq.map((line, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 flex items-center justify-between"
            >
              <div className="text-sm">{line}</div>
              <div className="flex items-center gap-2">
                <button
                  className="text-xs px-2 py-1 border rounded"
                  onClick={() => moveUp(idx)}
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  className="text-xs px-2 py-1 border rounded"
                  onClick={() => moveDown(idx)}
                  aria-label="Move down"
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <PrimaryButton onClick={submitT2} disabled={!unlocked}>
            Submit Task 2
          </PrimaryButton>
        </div>
      </Card>

      {/* Task 2 Result */}
      <Modal open={t2Submitted} onClose={() => setT2Submitted(false)} title="Task 2 feedback">
        {t2Correct ? (
          <div className="text-green-700 text-sm">Nice. Your sequence matches the original.</div>
        ) : (
          <div className="text-sm">
            <div className="text-red-700">Not quite.</div>
            <div className="mt-2">
              <div className="font-medium">Correct order:</div>
              <ol className="list-decimal ml-5">
                {data.task2.paraphrasesInOrder.map((l, i) => (
                  <li key={i} className="text-sm">
                    {l}
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-2">
              <div className="font-medium">Your order:</div>
              <ol className="list-decimal ml-5">
                {seq.map((l, i) => (
                  <li key={i} className="text-sm">
                    {l}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
