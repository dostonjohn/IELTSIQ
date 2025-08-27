export const isValidTo = (to) => typeof to === "string" && to.trim().length > 0;
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const sum = (arr) => arr.reduce((a, b) => a + b, 0);

export const countWords = (text) => (text.trim() ? text.trim().split(/\s+/).length : 0);
export const countChars = (text) => text.length;
export const wpmFrom = (chars, ms) => {
  if (!ms || ms <= 0) return 0;
  const minutes = ms / 60000;
  return Math.round(((chars / 5) / minutes) || 0);
};
export const countCorrectChars = (target, typed) => {
  const n = Math.min(target.length, typed.length);
  let ok = 0;
  for (let i = 0; i < n; i++) if (typed[i] === target[i]) ok++;
  return ok;
};
export const buildPassage = () => {
  const bank = [
    "cohesion","coherence","band","criterion","lexical","fluency","paraphrase","synonym","contrast",
    "evaluate","analyze","justify","summarize","hypothesis","interpret","assess","outline",
    "graph","chart","diagram","trend","decline","surge","fluctuate","peak","plateau",
    "listening","reading","writing","speaking","vocabulary","grammar","pronunciation","accuracy",
  ];
  const words = Array.from({ length: 200 }, (_, i) => bank[i % bank.length]);
  return words.join(" ") + ".";
};
