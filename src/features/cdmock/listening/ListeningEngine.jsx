import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAudioSequencer } from "./hooks/useAudioSequencer";
import { useCountdown } from "./hooks/useCountdown";

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function bandScore(correct, total) {
  const pct = (correct / total) * 100;
  if (pct >= 90) return 9;
  if (pct >= 80) return 8;
  if (pct >= 70) return 7;
  if (pct >= 60) return 6;
  if (pct >= 50) return 5;
  if (pct >= 40) return 4;
  if (pct >= 30) return 3;
  return 2;
}

function normalize(s) {
  return String(s ?? "").trim().toLowerCase();
}

export default function ListeningEngine({ slug }) {
  const [activity, setActivity] = useState(null);
  const [answers, setAnswers] = useState({});
  const [locked, setLocked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/activities/${slug}/questions.json`);
        const data = await res.json();
        setActivity(data);
      } catch (e) {
        console.error("Failed to load questions.json", e);
      }
    })();
  }, [slug]);

  const tracks = useMemo(
    () =>
      [1, 2, 3, 4].map((s) => ({
        src: `/activities/${slug}/track/s${s}.mp3`,
        sectionId: s,
      })),
    [slug]
  );

  const { idx, isPlaying, play, pause, currentSection, done } = useAudioSequencer(tracks);
  const { label: timer } = useCountdown(30 * 60);

  useEffect(() => {
    setLocked(isPlaying);
  }, [isPlaying]);

  const current = activity?.sections?.find((s) => s.id === currentSection);

  const onAnswer = (qid, value) => {
    setAnswers((a) => ({ ...a, [qid]: value }));
  };

  const computeScore = () => {
    if (!activity) return;
    let correct = 0;
    let total = 0;
    for (const sec of activity.sections) {
      if (sec.type === "mcq") {
        for (const q of sec.questions) {
          total++;
          if (String(answers[q.qid]) === String(q.answer)) correct++;
        }
      } else if (sec.type === "gapfill") {
        for (const q of sec.questions) {
          total++;
          const ans = String(answers[q.qid] ?? "");
          try {
            const re = new RegExp(q.answerPattern, "i");
            if (re.test(normalize(ans))) correct++;
          } catch {}
        }
      } else if (sec.type === "composite" && Array.isArray(sec.items)) {
        for (const item of sec.items) {
          total++;
          if (item.kind === "mcq") {
            if (String(answers[item.qid]) === String(item.answer)) correct++;
          } else if (item.kind === "gap") {
            const ans = String(answers[item.qid] ?? "");
            try {
              const re = new RegExp(item.answerPattern, "i");
              if (re.test(normalize(ans))) correct++;
            } catch {}
          }
        }
      }
    }
    const band = bandScore(correct, total);
    setScore({ correct, total, band });
  };

  const submit = () => {
    setSubmitted(true);
    computeScore();
  };

  if (!activity) {
    return (
      <div className="p-6">
        <div role="status" aria-live="polite" className="animate-pulse h-6 w-40 bg-gray-300 rounded" />
        <div className="mt-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-semibold">Listening • {activity.activityName}</h2>
          <p className="text-sm text-gray-600">Timer: <span aria-live="polite">{timer}</span></p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 rounded border focus:outline-none focus:ring focus:ring-offset-2"
            onClick={isPlaying ? pause : play}
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <span className="text-sm">Track {idx + 1}/4</span>
        </div>
      </header>

      <nav className="mt-4 flex gap-2" aria-label="Sections">
        {[1, 2, 3, 4].map((s) => (
          <button
            key={s}
            disabled
            className={classNames(
              "px-3 py-1 rounded border text-sm",
              s === currentSection && "bg-gray-100 font-medium",
              "cursor-not-allowed opacity-60"
            )}
            aria-pressed={s === currentSection}
            aria-label={`Section ${s}`}
            title="Sections unlock automatically after each track"
          >
            Section {s}
          </button>
        ))}
      </nav>

      <main className="mt-6">
        {current ? (
          <SectionView
            section={current}
            locked={locked}
            answers={answers}
            onAnswer={onAnswer}
          />
        ) : (
          <p className="text-gray-600">Loading section…</p>
        )}
      </main>

      <footer className="mt-8 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {done ? "Audio complete." : "Audio playing order: Sections 1 → 4"}
        </p>
        <button
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50 focus:outline-none focus:ring focus:ring-offset-2"
          onClick={submit}
          disabled={!done || submitted}
        >
          {submitted ? "Submitted" : "Submit answers"}
        </button>
      </footer>

      {submitted && score && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="font-semibold">Results</h3>
          <p className="text-sm text-gray-700 mt-1">
            Correct: {score.correct}/{score.total} • Estimated Band: <strong>{score.band}.0</strong>
          </p>
        </div>
      )}
    </div>
  );
}

function SectionView({ section, locked, answers, onAnswer }) {
  if (section.type === "composite") {
    return (
      <div className="space-y-4" aria-busy={locked}>
        <h3 className="text-base font-medium">{section.title}</h3>
        <CompositeItems items={section.items} locked={locked} answers={answers} onAnswer={onAnswer} />
        {locked && <div className="text-xs text-gray-600">Inputs are disabled while audio is playing.</div>}
      </div>
    );
  }
  return (
    <div className="space-y-4" aria-busy={locked}>
      <h3 className="text-base font-medium">{section.title}</h3>
      {section.type === "mcq" ? (
        <div className="space-y-4">
          {section.questions.map((q) => (
            <MCQItem key={q.qid} q={q} locked={locked} answer={answers[q.qid]} onAnswer={onAnswer} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {section.questions.map((q) => (
            <GapInline key={q.qid} html={q.html || q.prompt} qid={q.qid} locked={locked} answer={answers[q.qid]} onAnswer={onAnswer} />
          ))}
        </div>
      )}
      {locked && <div className="text-xs text-gray-600">Inputs are disabled while audio is playing.</div>}
    </div>
  );
}

function CompositeItems({ items, locked, answers, onAnswer }) {
  return (
    <div className="space-y-4">
      {items.map((item) => {
        if (item.kind === "mcq") {
          return <MCQItem key={item.qid} q={item} locked={locked} answer={answers[item.qid]} onAnswer={onAnswer} />;
        }
        if (item.kind === "gap") {
          return <GapInline key={item.qid} html={item.html} qid={item.qid} locked={locked} answer={answers[item.qid]} onAnswer={onAnswer} />;
        }
        return null;
      })}
    </div>
  );
}

function MCQItem({ q, locked, answer, onAnswer }) {
  return (
    <fieldset className="border rounded p-3">
      <legend className="font-medium">{q.prompt}</legend>
      <div className="mt-2 grid gap-2">
        {q.options.map((opt, i) => {
          const id = `${q.qid}-${i}`;
          return (
            <label key={id} htmlFor={id} className={classNames("flex items-center gap-2")}>
              <input
                id={id}
                type="radio"
                name={q.qid}
                value={i}
                disabled={locked}
                checked={String(answer) === String(i)}
                onChange={() => onAnswer(q.qid, i)}
                className="focus:ring focus:ring-offset-2"
              />
              <span>{opt}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function GapInline({ html, qid, locked, answer, onAnswer }) {
  const containerRef = useRef(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let input = el.querySelector(`input#${CSS.escape(qid)}`);
    if (!input) {
      input = document.createElement("input");
      input.type = "text";
      input.id = qid;
      input.className = "inline-block align-middle px-2 py-1 border rounded";
      input.style.display = "inline-block";
      input.style.width = "12ch";       // tweak this width if you like
      el.appendChild(input);
    }
    input.disabled = locked;
    input.value = String(answer ?? "");
    const onInput = (e) => onAnswer(qid, e.target.value);
    input.addEventListener("input", onInput);
    return () => input.removeEventListener("input", onInput);
  }, [qid, locked, answer, onAnswer]);

  return (
    <div ref={containerRef} className="leading-7" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
