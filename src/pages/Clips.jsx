import React, { useEffect, useMemo, useRef, useState } from "react";
import Card from "../components/Card"; // optional visual consistency
import PrimaryButton from "../components/PrimaryButton";
import manifest from "../data/clipsManifest.json";

/* Load YouTube Iframe API once */
function useYouTubeAPI() {
  const [ready, setReady] = useState(!!window.YT && !!window.YT.Player);
  useEffect(() => {
    if (ready) return;
    const onReady = () => setReady(true);
    if (window.YT && window.YT.Player) {
      setReady(true);
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev && prev();
      onReady();
    };
  }, [ready]);
  return ready;
}

function extractVideoId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2];
      if (u.pathname === "/watch") return u.searchParams.get("v");
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2];
    }
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
  } catch {}
  return null;
}

// Vertical feel like IG Reels (slightly shorter on big screens)
const aspect = "aspect-[9/16] md:aspect-[9/15] lg:aspect-[9/14]";

export default function Clips() {
  const apiReady = useYouTubeAPI();
  const containerRef = useRef(null);
  const playersRef = useRef({});     // id -> YT.Player
  const endPollers = useRef({});     // id -> interval
  const [activeIndex, setActiveIndex] = useState(0);
  const [taskOpen, setTaskOpen] = useState({}); // id -> boolean
  const [answers, setAnswers] = useState({});   // id -> userAnswer
  const [results, setResults] = useState({});   // id -> {correct:boolean, explanation?:string}

  // Sound: enable audio after the first user gesture
  const [allowSound, setAllowSound] = useState(false);
  const [showSoundHint, setShowSoundHint] = useState(true);

  useEffect(() => {
    const unlock = () => {
      setAllowSound(true);
      setShowSoundHint(false);
      const cur = items[activeIndex];
      const p = cur && playersRef.current[cur.id];
      try {
        if (p && p.unMute) { p.unMute(); safePlay(p); }
      } catch {}
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const items = useMemo(() => {
    return manifest
      .map(m => ({ ...m, videoId: extractVideoId(m.url) }))
      .filter(x => !!x.videoId);
  }, []);

  // One-player rule
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll("[data-card]"));
    const obs = new IntersectionObserver((entries) => {
      let best = { idx: activeIndex, ratio: 0 };
      entries.forEach(e => {
        const idx = Number(e.target.getAttribute("data-idx"));
        if (e.intersectionRatio > best.ratio) best = { idx, ratio: e.intersectionRatio };
      });
      if (best.ratio > 0) setActiveIndex(best.idx);
    }, { root: null, threshold: [0.5, 0.75, 0.9] });
    cards.forEach(el => obs.observe(el));
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  // Pause others; play active (with or without sound)
  useEffect(() => {
    const players = playersRef.current;
    Object.entries(players).forEach(([id, p]) => {
      try {
        if (!p || !p.getPlayerState) return;
        const i = items.findIndex(it => it.id === id);
        if (i === activeIndex) {
          if (allowSound && p.unMute) p.unMute(); else if (p.mute) p.mute();
          safePlay(p);
        } else {
          p.pauseVideo && p.pauseVideo();
        }
      } catch {}
    });
  }, [activeIndex, apiReady, allowSound, items]);

  // Init players
  useEffect(() => {
    if (!apiReady) return;
    items.forEach((it, idx) => {
      const frameId = `yt-${it.id}`;
      if (playersRef.current[it.id]) return;
      const el = document.getElementById(frameId);
      if (!el) return;
      // eslint-disable-next-line no-undef
      const player = new window.YT.Player(frameId, {
        videoId: it.videoId,
        playerVars: {
          autoplay: 0,
          modestbranding: 1,   // reduce YT logo
          rel: 0,              // related from same channel
          fs: 0,               // hide fullscreen button
          cc_load_policy: 0,   // captions off by default
          iv_load_policy: 3,   // limit in-video cards/annotations
          playsinline: 1,
          start: it.start || 0,
          controls: 1,
          enablejsapi: 1
        },
        events: {
          onReady: (e) => {
            if (idx === activeIndex) {
              try {
                if (allowSound && e.target.unMute) e.target.unMute();
                else if (e.target.mute) e.target.mute();
              } catch {}
              safePlay(e.target);
            }
          },
          onStateChange: (e) => {
            // 0 = ended, 1 = playing, 2 = paused
            if (e.data === 1) {
              // Pause slightly before end to avoid YT "Watch on YouTube"
              const dur = safeGetDuration(e.target);
              const hardEnd = (typeof it.end === "number" && it.end > 0) ? it.end : dur;
              const stopAt = Math.max(0, hardEnd - 0.2); // ~200ms before end
              startEndWatch(it.id, e.target, stopAt, () => {
                try { e.target.pauseVideo(); } catch {}
                setTaskOpen(prev => ({ ...prev, [it.id]: true }));
              });
            }
            if (e.data === 0) {
              // Fallback if near-end watcher misses
              setTaskOpen(prev => ({ ...prev, [it.id]: true }));
            }
          }
        }
      });
      playersRef.current[it.id] = player;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiReady, items, activeIndex, allowSound]);

  function safeGetDuration(player) {
    try { return player.getDuration ? player.getDuration() : 0; } catch { return 0; }
  }

  function startEndWatch(id, player, stopAt, onHit) {
    clearInterval(endPollers.current[id]);
    endPollers.current[id] = setInterval(() => {
      try {
        const t = player.getCurrentTime ? player.getCurrentTime() : 0;
        if (t >= stopAt) {
          clearInterval(endPollers.current[id]);
          onHit();
        }
      } catch {}
    }, 100);
  }

  function safePlay(player) {
    try {
      const maybe = player.playVideo && player.playVideo();
      if (maybe && typeof maybe.then === "function") {
        maybe.catch(() => {
          try { player.mute && player.mute(); } catch {}
          try { player.playVideo && player.playVideo(); } catch {}
          setShowSoundHint(true);
        });
      }
    } catch {
      try { player.mute && player.mute(); } catch {}
      try { player.playVideo && player.playVideo(); } catch {}
      setShowSoundHint(true);
    }
  }

  function submitAnswer(it, value) {
    const t = it.task;
    let correct = false;
    if (t.type === "mcq") {
      correct = Number(value) === Number(t.answerIndex);
    } else {
      const norm = String(value || "").trim().toLowerCase();
      const accepted = (t.answers || []).map(a => String(a).trim().toLowerCase());
      correct = accepted.includes(norm);
    }
    setAnswers(prev => ({ ...prev, [it.id]: value }));
    setResults(prev => ({ ...prev, [it.id]: { correct, explanation: it.explanation || "" } }));
    // auto-advance
    const nextIdx = Math.min(items.length - 1, items.findIndex(x => x.id === it.id) + 1);
    setTimeout(() => {
      setTaskOpen(prev => ({ ...prev, [it.id]: false }));
      setActiveIndex(nextIdx);
      const next = items[nextIdx];
      const p = playersRef.current[next.id];
      if (p && p.playVideo) {
        if (allowSound && p.unMute) p.unMute(); else if (p.mute) p.mute();
        safePlay(p);
      }
      const curp = playersRef.current[it.id];
      curp && curp.pauseVideo && curp.pauseVideo();
    }, 700);
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-2">
        <button className="text-sm text-gray-500 hover:text-gray-800" onClick={() => history.back()}>&larr; Back</button>
        <h1 className="text-xl font-semibold">Clips</h1>
        <span className="text-xs text-gray-500">Watch & answer. No scores, just practice.</span>
      </div>

      {/* One-time sound hint */}
      {showSoundHint && !allowSound && (
        <div className="mx-auto mb-3 w-full max-w-[360px] md:max-w-[400px] lg:max-w-[420px]">
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-amber-50 text-amber-900 px-3 py-2 text-xs">
            Click anywhere to enable sound for all clips.
          </div>
        </div>
      )}

      <div ref={containerRef} className="space-y-8">
        {items.map((it, idx) => (
          <div
            key={it.id}
            data-card
            data-idx={idx}
            className="mx-auto w-full max-w-[360px] md:max-w-[400px] lg:max-w-[420px]"
          >
            <div className={`rounded-2xl overflow-hidden bg-black ${aspect} relative`}>
              <div className="absolute inset-0">
                {/* YT iframe placeholder (replaced by API) */}
                <div id={`yt-${it.id}`} className="w-full h-full"></div>
              </div>

              {/* Top title mask: hides Shorts title/handle without blocking clicks */}
              {!taskOpen[it.id] && (
                <div
                  className="
                    pointer-events-none
                    absolute top-0 left-0 right-0
                    h-16 md:h-14 lg:h-12
                    bg-gradient-to-b from-black/90 via-black/60 to-transparent
                    z-20
                  "
                />
              )}

              {/* Task overlay (shows at video end, sits above mask) */}
              {taskOpen[it.id] && (
                <div className="absolute inset-x-0 bottom-0 bg-white/95 dark:bg-neutral-900/95 p-4 border-t border-black/10 dark:border-white/10 z-30">
                  <TaskForm item={it} onSubmit={submitAnswer} value={answers[it.id]} result={results[it.id]} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskForm({ item, value, result, onSubmit }) {
  const [local, setLocal] = useState(value ?? (item.task.type === "mcq" ? -1 : ""));
  useEffect(() => setLocal(value ?? (item.task.type === "mcq" ? -1 : "")), [item.id]);
  const disabled = !!result;
  return (
    <div>
      <p className="text-sm font-medium mb-2">{item.task.prompt}</p>
      {item.task.type === "mcq" ? (
        <div className="space-y-2">
          {item.task.options.map((opt, i) => (
            <label key={i} className={`flex items-center gap-2 rounded-lg border p-2 cursor-pointer ${Number(local)===i?'border-blue-500':'border-black/10 dark:border-white/10'}`}>
              <input
                type="radio"
                name={`opt-${item.id}`}
                className="accent-blue-600"
                disabled={disabled}
                checked={Number(local) === i}
                onChange={() => setLocal(i)}
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      ) : (
        <input
          className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/10 p-2 text-sm"
          placeholder="Type your answer"
          disabled={disabled}
          value={local}
          onChange={e => setLocal(e.target.value)}
        />
      )}
      <div className="mt-3 flex items-center gap-2">
        {!result ? (
          <button
            className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
            disabled={(item.task.type === "mcq" ? Number(local) < 0 : String(local).trim() === "")}
            onClick={() => onSubmit(item, local)}
          >
            Check answer
          </button>
        ) : (
          <div>
            <p className={`text-sm ${result.correct ? 'text-green-600' : 'text-red-600'}`}>
              {result.correct ? 'Correct' : 'Incorrect'}
            </p>
            {item.explanation && <p className="text-xs text-gray-500 mt-1">{item.explanation}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
