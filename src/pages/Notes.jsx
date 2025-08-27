import React, { useEffect, useMemo, useState } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import Modal from '../components/Modal';
import { loadNotes, saveNotes, updateNote, removeNote, NOTES_EVENT } from '../utils/notesStore';

function NoteCard({ note, onEdit, onDelete }) {
  return (
    <div
      className="group relative rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black p-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
      style={{ willChange: 'transform' }}
    >
      <div className="absolute right-3 top-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all flex gap-2">
        <button
          onClick={() => onEdit(note)}
          className="px-2 py-1 text-xs rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(note)}
          className="px-2 py-1 text-xs rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-700/40 dark:hover:bg-red-900/30"
        >
          Delete
        </button>
      </div>
      <h2 className="text-lg font-semibold truncate pr-16">{note.title || 'Untitled'}</h2>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap line-clamp-4">{note.body}</p>
      <div className="mt-3 text-xs text-gray-500">
        {new Date(note.updatedAt || note.createdAt).toLocaleString()}
      </div>
    </div>
  );
}

export default function Notes() {
  const [notes, setNotes] = useState(() => loadNotes());
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState({ id: null, title: '', body: '' });

  useEffect(() => {
    const onChanged = () => setNotes(loadNotes());
    window.addEventListener(NOTES_EVENT, onChanged);
    return () => window.removeEventListener(NOTES_EVENT, onChanged);
  }, []);

  // Sort newest first
  const sorted = useMemo(() => {
    return [...notes].sort((a,b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));
  }, [notes]);

  const filtered = useMemo(() => {
    if (!query.trim()) return sorted;
    const q = query.toLowerCase();
    return sorted.filter(n =>
      (n.title || '').toLowerCase().includes(q) || (n.body || '').toLowerCase().includes(q)
    );
  }, [sorted, query]);

  const openNew = () => {
    setDraft({ id: null, title: '', body: '' });
    setModalOpen(true);
  };

  const openEdit = (note) => {
    setDraft({ id: note.id, title: note.title || '', body: note.body || '' });
    setModalOpen(true);
  };

  const onSave = () => {
    if (!draft.id) {
      // Creating via QuickNotePortal is preferred for global shortcut,
      // but allow creation here too for the + button.
      const now = Date.now();
      const newNote = { id: `${now}-${Math.random().toString(36).slice(2,8)}`, title: draft.title.trim(), body: draft.body.trim(), createdAt: now, updatedAt: now };
      const updated = [newNote, ...notes];
      saveNotes(updated);
      setNotes(updated);
    } else {
      const updated = updateNote(draft.id, { title: draft.title.trim(), body: draft.body.trim() });
      setNotes(prev => prev.map(n => n.id === draft.id ? updated : n));
    }
    setModalOpen(false);
  };

  const onDelete = (note) => {
    if (!confirm('Delete this note?')) return;
    removeNote(note.id);
    setNotes(loadNotes());
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Notes</h1>
          <p className="text-xs text-gray-500">New note (Ctrl/Cmd + .)</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            placeholder="Search notes..."
            className="hidden md:block w-[260px] rounded-lg border border-black/10 dark:border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <PrimaryButton onClick={openNew}>+ New note</PrimaryButton>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-20 text-center animate-[floatUp_.25s_ease-out]">
          <div className="mx-auto mb-3 w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center">
            <div className="w-5 h-5 rounded-lg bg-blue-600" aria-hidden />
          </div>
          <p className="text-sm font-medium">No notes yet</p>
          <p className="text-xs text-gray-500">Press + or Ctrl/Cmd + . to create one.</p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">{filtered.map(n => (
          <NoteCard key={n.id} note={n} onEdit={openEdit} onDelete={onDelete} />
        ))}</div>
      )}

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title={draft.id ? 'Edit note' : 'New note'}>
        <div className="space-y-2">
          <input
            value={draft.title}
            onChange={(e)=>setDraft(d => ({...d, title: e.target.value}))}
            placeholder="Title"
            className="w-full rounded-lg border border-black/10 dark:border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={draft.body}
            onChange={(e)=>setDraft(d => ({...d, body: e.target.value}))}
            placeholder="Write your note..."
            className="w-full rounded-lg border border-black/10 dark:border-white/10 px-3 py-2 min-h-[160px] resize-y outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={()=>setModalOpen(false)} className="px-3 py-2 rounded-lg border border-black/10 dark:border-white/10">Cancel</button>
            <PrimaryButton onClick={onSave}>{draft.id ? 'Save' : 'Add'}</PrimaryButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
