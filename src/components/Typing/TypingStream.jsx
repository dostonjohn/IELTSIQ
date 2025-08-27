import React, { memo } from 'react'
import Caret from './Caret'

const TypingStreamBase = ({ target, typed, shake }) => {
  const len = target.length;
  const out = [];
  for (let i = 0; i < len; i++) {
    const t = target[i];
    const u = typed[i];
    let cls = "text-gray-400/80";
    if (u != null) {
      cls = u === t ? "text-emerald-600" : "text-rose-600 bg-rose-50 dark:bg-rose-500/10";
    }
    const showCaret = i === typed.length;
    out.push(
      <span key={i} className={`whitespace-pre-wrap ${cls}`}>
        {showCaret && <Caret />}
        {t}
      </span>
    );
  }
  if (typed.length >= len) {
    out.push(<span key="caret-end" className="whitespace-pre-wrap"><Caret /></span>);
    for (let j = len; j < typed.length; j++) {
      out.push(<span key={"x"+j} className="text-rose-600 bg-rose-50 dark:bg-rose-500/10 whitespace-pre-wrap">{typed[j]}</span>);
    }
  }
  return (
    <div className={`rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 p-4 font-mono text-[15px] leading-7 selection:bg-indigo-200/60 dark:selection:bg-indigo-400/30 ${shake ? 'animate-shake' : ''}`}>
      <div className="whitespace-pre-wrap break-words">{out}</div>
    </div>
  );
};

const TypingStream = memo(TypingStreamBase, (prev, next) => prev.typed === next.typed && prev.target === next.target && prev.shake === next.shake);
export default TypingStream
