import React, { memo, useEffect, useMemo, useRef } from 'react'
import Caret from './Caret'

const TypingStreamBase = ({ target, typed, shake }) => {
  // Memoize the static span elements for the target text
  const baseSpans = useMemo(
    () => Array.from(target).map((c, i) => (
      <span key={i} className="whitespace-pre-wrap text-gray-400/80">{c}</span>
    )),
    [target]
  );

  // Keep a mutable reference to the spans so we can update only new characters
  const spansRef = useRef([...baseSpans]);
  const prevTypedRef = useRef(0);

  // Reset spans when the target changes
  useEffect(() => {
    spansRef.current = [...baseSpans];
    prevTypedRef.current = 0;
  }, [baseSpans]);

  // Update only the spans that correspond to newly typed characters
  useEffect(() => {
    const prevLen = prevTypedRef.current;
    if (typed.length < prevLen) {
      // Handle backspace by restoring original spans
      for (let i = typed.length; i < prevLen && i < target.length; i++) {
        spansRef.current[i] = baseSpans[i];
      }
      spansRef.current.length = Math.max(target.length, typed.length);
    } else {
      // Apply styling for newly typed characters within the target
      for (let i = prevLen; i < typed.length && i < target.length; i++) {
        const t = target[i];
        const u = typed[i];
        const cls = u === t ? 'text-emerald-600' : 'text-rose-600 bg-rose-50 dark:bg-rose-500/10';
        spansRef.current[i] = (
          <span key={i} className={`whitespace-pre-wrap ${cls}`}>{t}</span>
        );
      }
      // Characters typed beyond the target
      for (let j = Math.max(target.length, prevLen); j < typed.length; j++) {
        const u = typed[j];
        spansRef.current[j] = (
          <span key={`x${j}`} className="text-rose-600 bg-rose-50 dark:bg-rose-500/10 whitespace-pre-wrap">{u}</span>
        );
      }
    }
    prevTypedRef.current = typed.length;
  }, [typed, target, baseSpans]);

  const caretIndex = typed.length
  const out = [
    ...spansRef.current.slice(0, caretIndex),
    <span key="caret" className="mr-[-1px]">
      <Caret className="animate-pulse" />
    </span>,
    ...spansRef.current.slice(caretIndex)
  ]

  return (
    <div className={`rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 p-4 font-mono text-[15px] leading-7 selection:bg-indigo-200/60 dark:selection:bg-indigo-400/30 ${shake ? 'animate-shake' : ''}`}>
      {/* Consider virtualized rendering or a single styled text node to reduce DOM nodes */}
      <div className="whitespace-pre-wrap break-words">{out}</div>
    </div>
  );
};

const TypingStream = memo(
  TypingStreamBase,
  (prev, next) => prev.typed === next.typed && prev.target === next.target && prev.shake === next.shake
);
export default TypingStream
