// src/components/mock/Recorder.jsx
import React, { useEffect, useRef, useState } from 'react';
export default function Recorder({ onBlob }){
  const [recording, setRecording] = useState(false);
  const [url, setUrl] = useState(null);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const recRef = useRef(null);

  useEffect(()=>()=>{ if (url) URL.revokeObjectURL(url); }, [url]);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const rec = new MediaRecorder(stream);
    rec.ondataavailable = (e)=>{ if (e.data && e.data.size>0) chunksRef.current.push(e.data); };
    rec.onstop = ()=>{
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      chunksRef.current = [];
      const u = URL.createObjectURL(blob);
      setUrl(u);
      onBlob && onBlob(blob);
    };
    recRef.current = rec;
    rec.start();
    setRecording(true);
  };
  const stop = ()=>{ recRef.current && recRef.current.stop(); setRecording(false); };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3">
      <div className="flex items-center gap-2">
        {!recording ? (
          <button onClick={start} className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white">Start recording</button>
        ) : (
          <button onClick={stop} className="px-3 py-1.5 rounded-xl bg-rose-600 text-white">Stop</button>
        )}
        {url && <audio controls src={url} className="ml-2" />}
      </div>
    </div>
  )
}
