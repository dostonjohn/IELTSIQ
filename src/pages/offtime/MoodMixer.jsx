// src/pages/offtime/MoodMixer.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useGlobalAudio } from "../../audio/GlobalAudioContext";

export default function MoodMixer() {
  const [query, setQuery] = useState("rain");
  const [results, setResults] = useState([]);
  const [mix, setMix] = useState([]);
  const [showCredits, setShowCredits] = useState(false);

  // from GlobalAudioContext
  const { addTrack, removeTrack, setVolume, setLoFi, pauseAll } = useGlobalAudio();

  const attributionList = useMemo(
    () => mix.filter(t => t.needsAttribution),
    [mix]
  );

  // Search API
  const search = useCallback(async () => {
    try {
      const r = await fetch(
        `/api/mood/search?q=${encodeURIComponent(query)}&min=6&max=20&limit=12`
      );
      const json = await r.json();
      setResults(json.results || []);
    } catch (e) {
      console.error("[mood_search_failed]", e);
      setResults([]);
    }
  }, [query]);

  useEffect(() => { search(); }, [search]);

  // HEAD preflight via proxy (avoid cached 304)
  const preflightOk = useCallback(async (rawUrl) => {
    const proxied = `/api/mood/stream?src=${encodeURIComponent(rawUrl)}`;
    try {
      const head = await fetch(proxied, { method: "HEAD", cache: "no-store" });
      if (!head.ok) return false;
      const ct = (head.headers.get("content-type") || "").toLowerCase();
      return ct.startsWith("audio/");
    } catch {
      return false;
    }
  }, []);

  // Add a result to the mix, always through the proxy
  const add = useCallback(async (t) => {
    const raw = t.src; // from search results
    if (!raw) return;

    // verify proxy HEAD reports audio/*
    const ok = await preflightOk(raw);
    if (!ok) {
      alert("This source is not a direct audio file. Try another result.");
      return;
    }

    const proxied = `/api/mood/stream?src=${encodeURIComponent(raw)}`;
    const track = {
      ...t,
      src: proxied,            // force playback through our proxy
      lofi: !!t.lofi
    };

    // update local UI state
    setMix(m => [...m.filter(x => x.id !== t.id), track]);

    // call global engine with the OBJECT signature + optional volume
    await addTrack(track, 0.6);
  }, [addTrack, preflightOk]);

  const onRemove = useCallback((id) => {
    setMix(m => m.filter(x => x.id !== id));
    removeTrack(id);
  }, [removeTrack]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Mood Mixer</h1>
      <p className="text-sm text-gray-400 mb-4">
        Search open-licensed loops (CC0/CC-BY) and build your own ambience.
      </p>

      <div className="flex gap-2 mb-4">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && search()}
          placeholder="rain, fire, typing, ocean, city..."
          className="w-full px-3 py-2 rounded border border-gray-600 bg-transparent outline-none focus:ring focus:ring-blue-500"
        />
        <button onClick={search} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500">
          Search
        </button>
        <button onClick={() => setShowCredits(true)} className="px-3 py-2 rounded border border-gray-600">
          Credits
        </button>
        {/* your global engine doesn't expose fadeOutAndStop; use pauseAll which fades+stops */}
        <button onClick={() => pauseAll()} className="px-3 py-2 rounded border border-gray-600">
          Fade out
        </button>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {results.map(t => (
          <div key={t.id} className="p-3 rounded border border-gray-700">
            <div className="font-medium truncate">{t.title}</div>
            <div className="text-xs text-gray-400 truncate">{t.author || t.source}</div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => add(t)} className="px-3 py-1 rounded bg-green-600 hover:bg-green-500">
                Add
              </button>
              {t.source_url && (
                <a href={t.source_url} target="_blank" rel="noreferrer"
                   className="px-3 py-1 rounded border border-gray-600">
                  Source
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mixer */}
      <h2 className="text-lg font-semibold mb-2">Your mix</h2>
      <div className="space-y-3">
        {mix.length === 0 && (
          <div className="text-sm text-gray-500">Nothing yet. Add some tracks from search.</div>
        )}
        {mix.map(t => (
          <div key={t.id} className="p-3 rounded border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-medium truncate">{t.title}</div>
                <div className="text-xs text-gray-400 truncate">{t.author || t.source}</div>
              </div>
              <button onClick={() => onRemove(t.id)} className="px-2 py-1 rounded border border-gray-600">
                Remove
              </button>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <label className="text-xs w-16">Volume</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                defaultValue={t.volume ?? 0.6}
                onChange={e => setVolume(t.id, Number(e.target.value))}
                className="w-full"
              />
              <label className="text-xs">Lo-fi</label>
              <input
                type="checkbox"
                defaultChecked={!!t.lofi}
                onChange={e => setLoFi(t.id, e.target.checked)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Credits modal */}
      {showCredits && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40">
          <div className="bg-[#111] border border-gray-700 rounded p-4 w-full max-w-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Credits</h3>
              <button onClick={() => setShowCredits(false)} className="px-2 py-1 border border-gray-600 rounded">
                Close
              </button>
            </div>
            <div className="text-sm">
              {attributionList.length === 0 && <p>No attributions required for the current mix.</p>}
              {attributionList.map(t => (
                <p key={t.id} className="mb-2">
                  {t.title} — {t.author} (CC-BY)
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
