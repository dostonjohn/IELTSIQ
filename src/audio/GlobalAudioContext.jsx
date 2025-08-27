// src/audio/GlobalAudioContext.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const GlobalAudioCtx = createContext(null);
export const useGlobalAudio = () => useContext(GlobalAudioCtx);

export const GlobalAudioProvider = ({ children }) => {
  // WebAudio core
  const ctxRef = useRef(null);
  const masterGainRef = useRef(null);

  // Per-track graph registry: id -> { src, gain, filter }
  const nodesRef = useRef(new Map());

  // State
  const [tracks, setTracks] = useState([]); // [{id,title,src,volume,lofi,needsAttribution}]
  const [isRunning, setRunning] = useState(false);
  const [ducked, setDucked] = useState(false);
  const [policy, setPolicy] = useState('allow'); // allow | duck | pause
  const [userActivated, setUserActivated] = useState(false);

  // Mini-player dismissal flag (persisted)
  const [miniDismissed, setMiniDismissed] = useState(false);

  // ---------- persistence ----------
  const persist = useCallback((next) => {
    try {
      localStorage.setItem(
        'moodMixerState.v1',
        JSON.stringify(
          next.map(t => ({
            id: t.id,
            title: t.title,
            src: t.src,
            volume: t.volume ?? 0.6,
            lofi: !!t.lofi,
            needsAttribution: !!t.needsAttribution,
          }))
        )
      );
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('moodMixerState.v1');
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved)) setTracks(saved);
      }
      const a = localStorage.getItem('moodMixerUserActivated.v1');
      if (a === '1') setUserActivated(true);
      const d = localStorage.getItem('moodMixerMiniDismissed.v1');
      if (d === '1') setMiniDismissed(true);
    } catch {}
  }, []);

  // ---------- audio context bootstrap ----------
  const ensureCtx = useCallback(async () => {
    if (!ctxRef.current) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctor();
      const master = ctx.createGain();
      master.gain.setValueAtTime(1, ctx.currentTime);
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterGainRef.current = master;
    }
    if (ctxRef.current.state === 'suspended') {
      await ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  // ---------- graph helpers ----------
  const makeNodes = useCallback((ctx, audioBuffer, initialVol = 0.6, useLoFi = false) => {
    const src = ctx.createBufferSource();
    src.buffer = audioBuffer;
    src.loop = true;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(initialVol, ctx.currentTime);

    let filter = null;
    if (useLoFi) {
      filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, ctx.currentTime);
      src.connect(filter);
      filter.connect(gain);
    } else {
      src.connect(gain);
    }

    gain.connect(masterGainRef.current);
    return { src, gain, filter };
  }, []);

  const stopAndDisconnect = useCallback((nodes) => {
    try { nodes.src.stop(0); } catch {}
    try { nodes.src.disconnect(); } catch {}
    try { nodes.gain.disconnect(); } catch {}
    if (nodes.filter) {
      try { nodes.filter.disconnect(); } catch {}
    }
  }, []);

  // Stop everything, clear state and persistence
  const clearAll = useCallback(() => {
    for (const [, n] of nodesRef.current) {
      try { n.src.stop(0); } catch {}
      try { n.src.disconnect(); } catch {}
      try { n.gain.disconnect(); } catch {}
      if (n.filter) { try { n.filter.disconnect(); } catch {} }
    }
    nodesRef.current.clear();
    setTracks([]);
    persist([]);
    setRunning(false);
  }, [persist]);

  // ---------- public API ----------
  // Add or replace a track. Accepts a track OBJECT and optional volume.
  const addTrack = useCallback(async (track, volume = 0.6) => {
    await ensureCtx();
    setUserActivated(true);
    try { localStorage.setItem('moodMixerUserActivated.v1', '1'); } catch {}

    // If the mini-player was dismissed, re-enable it on first real playback
    setMiniDismissed(false);
    try { localStorage.setItem('moodMixerMiniDismissed.v1', '0'); } catch {}

    const ctx = ctxRef.current;

    // Fetch via our proxy; only accept audio/*
    const res = await fetch(track.src, { method: 'GET', cache: 'no-store', mode: 'cors' });
    if (!res.ok) throw new Error('audio_fetch_failed');
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (ct && !ct.startsWith('audio/')) throw new Error('not_audio_content_type');

    const arr = await res.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arr);

    // Replace existing id if present
    const prev = nodesRef.current.get(track.id);
    if (prev) stopAndDisconnect(prev);

    const nodes = makeNodes(ctx, audioBuffer, volume, !!track.lofi);
    nodes.src.start(0);
    nodesRef.current.set(track.id, nodes);

    const next = [
      ...tracks.filter(t => t.id !== track.id),
      {
        id: track.id,
        title: track.title,
        src: track.src,
        volume,
        lofi: !!track.lofi,
        needsAttribution: !!track.needsAttribution,
      },
    ];
    setTracks(next);
    persist(next);
    setRunning(true);
  }, [ensureCtx, makeNodes, persist, stopAndDisconnect, tracks]);

  const removeTrack = useCallback((id) => {
    const existing = nodesRef.current.get(id);
    if (existing) {
      stopAndDisconnect(existing);
      nodesRef.current.delete(id);
    }
    const next = tracks.filter(t => t.id !== id);
    setTracks(next);
    persist(next);
    if (next.length === 0) setRunning(false);
  }, [persist, stopAndDisconnect, tracks]);

  const setVolume = useCallback((id, vol) => {
    const n = nodesRef.current.get(id);
    if (n) {
      const ctx = ctxRef.current;
      const now = ctx ? ctx.currentTime : 0;
      try {
        n.gain.gain.cancelScheduledValues(now);
        n.gain.gain.setValueAtTime(n.gain.gain.value, now);
        n.gain.gain.linearRampToValueAtTime(vol, now + 0.12);
      } catch {
        n.gain.gain.value = vol;
      }
    }
    const next = tracks.map(t => (t.id === id ? { ...t, volume: vol } : t));
    setTracks(next);
    persist(next);
  }, [persist, tracks]);

  const setLoFi = useCallback((id, flag) => {
    const n = nodesRef.current.get(id);
    if (n) {
      const ctx = ctxRef.current;
      if (flag && !n.filter) {
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, ctx.currentTime);
        try { n.src.disconnect(); } catch {}
        n.src.connect(filter);
        filter.connect(n.gain);
        n.filter = filter;
      } else if (!flag && n.filter) {
        try { n.src.disconnect(); } catch {}
        try { n.filter.disconnect(); } catch {}
        n.src.connect(n.gain);
        n.filter = null;
      }
    }
    const next = tracks.map(t => (t.id === id ? { ...t, lofi: !!flag } : t));
    setTracks(next);
    persist(next);
  }, [persist, tracks]);

  const pauseAll = useCallback((fadeMs = 600) => {
    const ctx = ctxRef.current;
    if (!ctx || !masterGainRef.current) return;
    const g = masterGainRef.current.gain;
    const now = ctx.currentTime;
    try {
      const current = g.value;
      g.cancelScheduledValues(now);
      g.setValueAtTime(current, now);
      g.linearRampToValueAtTime(0, now + fadeMs / 1000);
    } catch {
      g.value = 0;
    }
    setRunning(false);
  }, []);

  const resumeAll = useCallback((fadeMs = 600, target = 1) => {
    const ctx = ctxRef.current;
    if (!ctx || !masterGainRef.current) return;
    ensureCtx().then(() => {
      const g = masterGainRef.current.gain;
      const now = ctxRef.current.currentTime;
      try {
        const current = g.value;
        g.cancelScheduledValues(now);
        g.setValueAtTime(current, now);
        g.linearRampToValueAtTime(target, now + fadeMs / 1000);
      } catch {
        g.value = target;
      }
      setRunning(tracks.length > 0);
    });
  }, [ensureCtx, tracks.length]);

  const duck = useCallback((on) => {
    const ctx = ctxRef.current;
    if (!ctx || !masterGainRef.current) return;
    const g = masterGainRef.current.gain;
    const now = ctx.currentTime;
    const target = on ? 0.3 : 1.0;
    try {
      const current = g.value;
      g.cancelScheduledValues(now);
      g.setValueAtTime(current, now);
      g.linearRampToValueAtTime(target, now + 0.3);
    } catch {
      g.value = target;
    }
    setDucked(!!on);
  }, []);

  // Mini-player dismissal: now fully stops audio and clears tracks
  const dismissMini = useCallback(() => {
    try { pauseAll(150); } catch {}
    clearAll();
    setMiniDismissed(true);
    try { localStorage.setItem('moodMixerMiniDismissed.v1', '1'); } catch {}
  }, [clearAll, pauseAll]);

  const undismissMini = useCallback(() => {
    setMiniDismissed(false);
    try { localStorage.setItem('moodMixerMiniDismissed.v1', '0'); } catch {}
  }, []);

  // Focus policy effect
  useEffect(() => {
    if (policy === 'pause') {
      pauseAll(300);
    } else if (policy === 'duck') {
      duck(true);
    } else {
      // allow
      if (miniDismissed) {
        duck(false);
        return; // do not auto-resume if the user dismissed the mini-player
      }
      duck(false);
      if (tracks.length > 0 && userActivated) resumeAll(300, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policy, miniDismissed]);

  const value = useMemo(() => ({
    // state
    tracks,
    isRunning,
    ducked,
    policy,
    userActivated,
    miniDismissed,

    // controls
    addTrack,
    removeTrack,
    setVolume,
    setLoFi,
    pauseAll,
    resumeAll,
    duck,

    // flags/policies
    setPolicy,
    setUserActivated,

    // mini-player
    dismissMini,
    undismissMini,
  }), [
    tracks,
    isRunning,
    ducked,
    policy,
    userActivated,
    miniDismissed,
    addTrack,
    removeTrack,
    setVolume,
    setLoFi,
    pauseAll,
    resumeAll,
    duck,
    setPolicy,
  ]);

  return (
    <GlobalAudioCtx.Provider value={value}>
      {children}
    </GlobalAudioCtx.Provider>
  );
};

export default GlobalAudioCtx
