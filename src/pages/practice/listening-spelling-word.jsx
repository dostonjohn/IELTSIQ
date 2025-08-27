import React, { useEffect, useRef, useState } from "react";
import { isCorrectStrict } from "../../utils/answerCheck";
import Card from "../../components/Card";

const DICT_URL = (w) =>
  `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(w)}`;

function pickAudioFromEntry(json) {
  const phonetics = json?.[0]?.phonetics || [];
  const firstAudio = phonetics.find((p) => p.audio)?.audio;
  return firstAudio || null;
}

async function fetchWordAndAudio(word) {
  const res = await fetch(DICT_URL(word));
  if (!res.ok) return { audio: null, word };
  const json = await res.json();
  return { audio: pickAudioFromEntry(json), word };
}

function randomWord() {
  const pool = [
    "environment",
    "accommodation",
    "schedule",
    "reconstruction",
    "access",
    "receipt",
    "address",
    "necessary",
    "recommend",
    "acknowledgement",
    "advertisement",
    "aluminium",
    "analysis",
    "argument",
    "artificial",
    "assignment",
    "atmosphere",
    "bachelor",
    "barbecue",
    "beginning",
    "brochure",
    "business",
    "candidate",
    "category",
    "cemetery",
    "chauffeur",
    "colleague",
    "colonel",
    "committee",
    "communicate",
    "competition",
    "conclusion",
    "conscience",
    "conscious",
    "contemporary",
    "curriculum",
    "definitely",
    "description",
    "development",
    "dissertation",
    "embarrass",
    "environment",
    "equipment",
    "especially",
    "exaggerate",
    "excellent",
    "exercise",
    "familiar",
    "foreign",
    "fulfil",
    "government",
    "grammar",
    "handkerchief",
    "hierarchy",
    "hospitality",
    "immediately",
    "independent",
    "inevitable",
    "inoculate",
    "intelligence",
    "interpretation", 
    "jewellery",
    "judgement",
    "language",
    "leisure",
    "liaison",
    "library",
    "maintenance",
    "management",
    "marvellous",
    "miscellaneous",
    "neighbour",
    "necessary",
    "occasion",
    "occurred",
    "parliament",
    "particular",
    "perceive",
    "performance",
    "personnel",
    "phenomenon",
    "possession",
    "preferred",
    "privilege",
    "pronunciation",
    "recommend",
    "referred",
    "restaurant",
    "rhythm",
    "schedule",
    "separate",
    "similar",
    "successful",
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function ListeningSpellingWord() {
  const audioRef = useRef(null);
  const [word, setWord] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadNext() {
    setResult(null);
    setInput("");
    setError("");
    setLoading(true);
    const w = randomWord();
    const { audio } = await fetchWordAndAudio(w);
    setWord(w);
    setAudioUrl(audio || "");
    setLoading(false);
  }

  useEffect(() => {
    loadNext();
  }, []);

  function play() {
    audioRef.current?.play();
  }
  function check() {
    const ok = isCorrectStrict(input, [word]);
    setResult(ok ? "correct" : "wrong");
  }

  return (
    <div className="space-y-4">
      <Card title="Single Word Dictation">
        <div className="space-x-2">
          <button
            onClick={play}
            disabled={!audioUrl || loading}
            className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10"
          >
            {loading ? "Loading…" : "Play"}
          </button>
          <button
            onClick={loadNext}
            className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10"
          >
            Next word
          </button>
        </div>
        <audio ref={audioRef} src={audioUrl} preload="none" />
        {!audioUrl && !loading && (
          <div className="text-sm text-amber-700 mt-2">
            No dictionary audio found for “{word}”. You can still type and
            check.
          </div>
        )}
        <div className="mt-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-white/10 p-2 bg-white/80 dark:bg-white/5"
            placeholder="Type the word here…"
          />
        </div>
        <div className="mt-2">
          <button
            onClick={check}
            className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10"
          >
            Check
          </button>
        </div>
        {result && (
          <div className="mt-2">
            {result === "correct" ? (
              <div className="text-green-700">✅ Correct!</div>
            ) : (
              <div className="text-red-700">
                ❌ Not quite. Correct spelling:{" "}
                <span className="font-semibold">{word}</span>
              </div>
            )}
          </div>
        )}
      </Card>
      <div>
        <a
          className="text-sm underline opacity-80"
          href="/practice/listening/spelling"
        >
          ← Back to Spelling menu
        </a>
      </div>
    </div>
  );
}
