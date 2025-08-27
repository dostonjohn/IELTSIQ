export function normalize(s=''){
  return String(s).trim().toLowerCase().replace(/\s+/g,' ');
}

export function isTF(val){
  const v = normalize(val);
  return v === 'true' || v === 'false';
}

export function checkAnswer(q, user){
  const val = normalize(user || '');
  if (q.type === 'tf') {
    // exact true/false typed
    return val === normalize(q.expected || '');
  }
  if (q.type === 'gap' || q.type === 'short') {
    const answers = (q.answer || []).map(normalize);
    return answers.includes(val);
  }
  return false;
}
