import { useEffect, useRef, useState } from 'react';

export function useAudioGraph() {
  const ctxRef = useRef(null);
  const masterGainRef = useRef(null);
  const [isRunning, setRunning] = useState(false);
  const nodesRef = useRef(new Map());

  const ensureCtx = async () => {
    if (!ctxRef.current) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const master = ctx.createGain();
      master.gain.value = 1;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterGainRef.current = master;
    }
    if (ctxRef.current && ctxRef.current.state === 'suspended') {
      await ctxRef.current.resume();
    }
    setRunning(true);
  };

  const addTrack = async (id, url, initialVol = 0.6) => {
    await ensureCtx();
    const ctx = ctxRef.current;
    // Use proxy stream to avoid CORS
    const proxied = `/api/mood/stream?src=${encodeURIComponent(url)}`;
    const res = await fetch(proxied);
    const arr = await res.arrayBuffer();
    const buffer = await ctx.decodeAudioData(arr);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const gain = ctx.createGain();
    gain.gain.value = initialVol;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 22050;

    source.connect(gain);
    gain.connect(filter);
    filter.connect(masterGainRef.current);

    source.start(0);
    nodesRef.current.set(id, { source, gain, filter });
  };

  const removeTrack = (id) => {
    const n = nodesRef.current.get(id);
    if (!n) return;
    try { n.source.stop(); } catch {}
    n.gain.disconnect();
    n.filter.disconnect();
    nodesRef.current.delete(id);
  };

  const setVolume = (id, v) => {
    const n = nodesRef.current.get(id);
    if (n) n.gain.gain.value = v;
  };

  const setLoFi = (id, on) => {
    const n = nodesRef.current.get(id);
    if (n) n.filter.frequency.value = on ? 1600 : 22050;
  };

  const fadeOutAndStop = async (ms = 1200) => {
    const ctx = ctxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + ms / 1000);
    await new Promise(r => setTimeout(r, ms + 50));
    nodesRef.current.forEach(n => { try { n.source.stop(); } catch {} });
    nodesRef.current.clear();
    setRunning(false);
  };

  useEffect(() => {
    return () => { try { fadeOutAndStop(200); } catch {} };
  }, []);

  return { isRunning, addTrack, removeTrack, setVolume, setLoFi, fadeOutAndStop };
}