
export const normalize = (s) => (s || '').toLowerCase().trim().replace(/\s+/g, ' ');

export const inAccepted = (input, accepted=[]) => {
  const norm = normalize(input);
  return accepted.map(normalize).includes(norm);
};

export const checkTFNG = (choice, answer) => normalize(choice) === normalize(answer);

export const selectMatchIsCorrect = (mapping, selections) => {
  // mapping: {key: [accepted...]}; selections: {key: value}
  for (const key of Object.keys(mapping)) {
    const accepted = mapping[key] || [];
    const picked = selections[key] || '';
    if (!accepted.map(normalize).includes(normalize(picked))) return false;
  }
  return true;
};
