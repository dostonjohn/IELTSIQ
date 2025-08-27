
function shuffle(arr){ return [...arr].sort(()=>Math.random()-0.5); }
export function buildQuiz(unit, optionCount=4){
  const pool = unit.words.filter(w => (w.uzbek && w.uzbek.trim().length>0));
  if(pool.length < optionCount) return [];
  const base = pool.slice(0,20); // max 20
  return shuffle(base).map((item, idx) => {
    const distractors = shuffle(base.filter(w=>w.english!==item.english)).slice(0, optionCount-1);
    const options = shuffle([{text:item.english, correct:true}, ...distractors.map(d=>({text:d.english, correct:false}))]);
    return { id: `${unit.id}-${idx+1}`, promptUz: item.uzbek, options, answer: item.english };
  });
}
