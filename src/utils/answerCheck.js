export function normalize(s) {
  return (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
}
export function isCorrectStrict(userText, answers) {
  const u = normalize(userText);
  return (answers || []).some(a => normalize(a) === u);
}
