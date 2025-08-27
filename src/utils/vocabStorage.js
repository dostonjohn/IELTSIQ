
const KEY = "ieltsiq.vocab.lastScores.v1";
function read(){ try{ const raw = localStorage.getItem(KEY); return raw? JSON.parse(raw): {}; } catch(e){ return {}; } }
function write(map){ try{ localStorage.setItem(KEY, JSON.stringify(map)); } catch(e){} }
export function getLastScore(bookId, unitId){ const map = read(); return map[`${bookId}-${unitId}`] || null; }
export function setLastScore(bookId, unitId, score, total){ const map = read(); map[`${bookId}-${unitId}`] = {score,total,ts:Date.now()}; write(map); }
