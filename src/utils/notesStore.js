export const NOTES_KEY = 'ieltsiq.notes:v1';
export const NOTES_EVENT = 'ieltsiq:notes-changed';

export function loadNotes() {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.notes)) return data.notes;
    return [];
  } catch (e) {
    console.warn('Failed to load notes', e);
    return [];
  }
}

export function saveNotes(notes) {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    window.dispatchEvent(new CustomEvent(NOTES_EVENT));
  } catch (e) {
    console.error('Failed to save notes', e);
    throw e;
  }
}

export function addNote({ title = '', body = '' }) {
  const now = Date.now();
  const note = {
    id: `${now}-${Math.random().toString(36).slice(2,8)}`,
    title: title.trim(),
    body: body.trim(),
    createdAt: now,
    updatedAt: now
  };
  const notes = loadNotes();
  const updated = [note, ...notes];
  saveNotes(updated);
  return note;
}

export function updateNote(id, patch) {
  const notes = loadNotes();
  const updated = notes.map(n => n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n);
  saveNotes(updated);
  return updated.find(n => n.id === id) || null;
}

export function removeNote(id) {
  const notes = loadNotes();
  const updated = notes.filter(n => n.id !== id);
  saveNotes(updated);
}
