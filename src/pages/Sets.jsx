import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FileText, Search as SearchIcon } from 'lucide-react'
import Card from '../components/Card'
import PrimaryButton from '../components/PrimaryButton'

const DifficultyBadge = ({ d }) => {
  const styles = {
    Beginner: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    Easy: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
    Medium: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    Hard: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
    "Extra Hard": "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-500/10 dark:text-fuchsia-300",
  }[d] || "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-200";
  return <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${styles}`}>{d}</span>;
};

const Chip = ({ label, active, onClick, icon }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm border transition-colors ${active ? "bg-indigo-600 text-white border-indigo-600" : "bg-white/70 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"}`}
  >
    {icon && <span aria-hidden>{icon}</span>}
    {label}
  </button>
);

const data = [
  { slug: "listening-basics-a1", title: "Listening Basics A1", type: "Listening", difficulty: "Beginner", items: 20, est: "15m", status: "Not started" },
  { slug: "listening-dialogues-a2", title: "Everyday Dialogues A2", type: "Listening", difficulty: "Easy", items: 16, est: "12m", status: "In progress" },
  { slug: "reading-facts-b1", title: "Reading Facts B1", type: "Reading", difficulty: "Medium", items: 18, est: "18m", status: "Not started" },
  { slug: "reading-academic-b2", title: "Academic Reading B2", type: "Reading", difficulty: "Hard", items: 14, est: "22m", status: "Not started" },
  { slug: "writing-task1-graphs", title: "Writing Task 1 - Graphs", type: "Writing", difficulty: "Medium", items: 4, est: "20m", status: "Not started" },
  { slug: "writing-task2-opinion", title: "Writing Task 2 - Opinion", type: "Writing", difficulty: "Hard", items: 1, est: "40m", status: "Not started" },
  { slug: "speaking-part1", title: "Speaking Part 1 - Daily Life", type: "Speaking", difficulty: "Beginner", items: 25, est: "15m", status: "Completed" },
  { slug: "speaking-cue-cards", title: "Speaking Part 2 - Cue Cards", type: "Speaking", difficulty: "Medium", items: 15, est: "18m", status: "Not started" },
  { slug: "grammar-articles", title: "Grammar - Articles A/An/The", type: "Grammar", difficulty: "Beginner", items: 20, est: "10m", status: "Not started" },
  { slug: "grammar-tenses-b1", title: "Grammar - Tenses B1", type: "Grammar", difficulty: "Medium", items: 25, est: "15m", status: "In progress" },
  { slug: "vocab-academic-topics", title: "Vocabulary - Academic Topics", type: "Vocabulary", difficulty: "Hard", items: 30, est: "20m", status: "Not started" },
  { slug: "mixed-set-starter", title: "Mixed Set - Starter", type: "Mixed", difficulty: "Easy", items: 20, est: "15m", status: "Not started" },
];
const ORDER = Object.fromEntries(data.map((r, i) => [r.slug, i + 1]));

const Sets = () => {
  const [search, setSearch] = useState("");
  const [params, setParams] = useSearchParams();
  const TYPES = ["All", "Listening", "Reading", "Writing", "Speaking", "Grammar", "Vocabulary"];
  const DIFFS = ["All", "Beginner", "Easy", "Medium", "Hard", "Extra Hard"];

  const activeType = params.get("type") || "All";
  const activeDiff = params.get("diff") || "All";

  const setType = (t) => setParams((prev) => { const p = new URLSearchParams(prev); p.set("type", t); return p; });
  const setDiff = (d) => setParams((prev) => { const p = new URLSearchParams(prev); p.set("diff", d); return p; });

  const filtered = data.filter((r) => {
    const typeOk = activeType === "All" ? true : r.type === activeType;
    const diffOk = activeDiff === "All" ? true : r.difficulty === activeDiff;
    const textOk = r.title.toLowerCase().includes(search.toLowerCase());
    return typeOk && diffOk && textOk;
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4">
        <Card className="h-full">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">Featured</p>
                <h3 className="text-xl font-bold">Full CD IELTS Mock</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Reading • Listening • Writing • Speaking</p>
              </div>
              <FileText className="shrink-0" size={26} />
            </div>
            <div className="mt-auto pt-4 flex items-center justify-between">
              <p className="text-xs text-gray-500">~ 2 hrs • Timed</p>
              <PrimaryButton to="/mock" className="px-3 py-1 text-xs" disabled title="Coming soon">Start mock</PrimaryButton>
            </div>
          </div>
        </Card>
        <Card className="h-full">
          <div className="flex flex-col h-full">
            <div>
              <h3 className="text-xl font-bold">Daily Mix</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">A quick blend from all skills to keep your streak.</p>
            </div>
            <div className="mt-auto pt-4">
              <PrimaryButton className="px-3 py-1 text-xs" disabled title="Coming soon">Start</PrimaryButton>
            </div>
          </div>
        </Card>
        <Card className="h-full">
          <div className="flex flex-col h-full">
            <div>
              <h3 className="text-xl font-bold">Streak Saver</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Only 5 minutes to keep your chain alive today.</p>
            </div>
            <div className="mt-auto pt-4">
              <PrimaryButton className="px-3 py-1 text-xs" disabled title="Coming soon">Start</PrimaryButton>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Filter sets">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Listening", "Reading", "Writing", "Speaking", "Grammar", "Vocabulary"].map((t) => (
              <Chip key={t} label={t} active={activeType === t} onClick={() => setType(t)}
                icon={t === "All" ? "🔎" : t === "Listening" ? "🎧" : t === "Reading" ? "📖" : t === "Writing" ? "✍️" : t === "Speaking" ? "🎤" : t === "Grammar" ? "🧩" : t === "Vocabulary" ? "🗂️" : null} />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Beginner", "Easy", "Medium", "Hard", "Extra Hard"].map((d) => (
              <Chip key={d} label={d} active={activeDiff === d} onClick={() => setDiff(d)} />
            ))}
          </div>
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search question sets…"
              className="w-full pl-10 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <div className="rounded-xl border border-gray-200 dark:border-white/10 divide-y divide-gray-100 dark:divide-white/10 min-w-[720px]">
            <div className="grid grid-cols-9 gap-2 py-2 text-xs font-medium text-gray-500">
              <div className="col-span-1 px-3 md:px-4">#</div>
              <div className="col-span-4 px-3 md:px-4">Title</div>
              <div className="col-span-2 px-3 md:px-4">Type</div>
              <div className="col-span-2 px-3 md:px-4">Difficulty</div>
            </div>
            {filtered.map((r) => (
              <div key={r.slug} className="grid grid-cols-9 gap-2 py-2 items-center text-sm hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                <div className="col-span-1 px-3 md:px-4 text-gray-500 tabular-nums">{ORDER[r.slug]}</div>
                <div className="col-span-4 px-3 md:px-4 font-medium"><Link to={`/sets/${r.slug}`} className="underline decoration-dotted hover:no-underline">{r.title}</Link></div>
                <div className="col-span-2 px-3 md:px-4"><span className="px-2 py-0.5 rounded-md text-xs bg-white/60 dark:bg-white/10 border border-gray-200 dark:border-white/10">{r.type}</span></div>
                <div className="col-span-2 px-3 md:px-4"><DifficultyBadge d={r.difficulty} /></div>
              </div>
            ))}
            {filtered.length === 0 && <div className="p-6 text-center text-sm text-gray-500">No sets match your filters.</div>}
          </div>
        </div>
      </Card>
    </>
  )
}

export default Sets
