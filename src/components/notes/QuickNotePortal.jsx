import React, { useEffect, useState, useRef } from 'react';
import Modal from '../Modal';
import PrimaryButton from '../PrimaryButton';
import { addNote } from '../../utils/notesStore';

function isEditable(el) {
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  const editable = el.getAttribute && el.getAttribute('contenteditable');
  return tag === 'input' || tag === 'textarea' || editable === '' || editable === 'true';
}

export default function QuickNotePortal() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const bodyRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      const key = e.key === '.' || e.key === '>';
      const hasMod = e.ctrlKey || e.metaKey;
      if (!hasMod || !key) return;
      if (isEditable(e.target)) return;
      e.preventDefault();
      setOpen(true);
      setTimeout(() => bodyRef.current?.focus(), 0);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onCreate = () => {
    if (!title.trim() && !body.trim()) return;
    addNote({ title, body });
    setTitle('');
    setBody('');
    setOpen(false);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal open={open} onClose={onClose} title="New note">
        <div className="space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            ref={bodyRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your note..."
            className="w-full border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 min-h-[140px] resize-y outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-3 py-2 rounded-lg border border-black/10 dark:border-white/10">Cancel</button>
            <PrimaryButton onClick={onCreate}>Add</PrimaryButton>
          </div>
          <p className="text-xs text-gray-500">Tip: Press Ctrl/Cmd + . anywhere to open this.</p>
        </div>
      </Modal>
    </>
  );
}
