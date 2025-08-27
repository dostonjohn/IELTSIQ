import React, { useState } from 'react'
import { Calculator, Activity as ActivityIcon, HelpCircle, ChevronRight, Users, Target, BookOpen, BarChart3, PieChart, Send, ExternalLink } from 'lucide-react'
import Card from '../components/Card'
import PrimaryButton from '../components/PrimaryButton'

const Collapse = ({ open, children }) => (
  <div className={`grid transition-[grid-template-rows] duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
    <div className="overflow-hidden">{children}</div>
  </div>
);

const Bullet = ({ icon: Icon, title, children }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 rounded-lg p-1.5 bg-black/5 dark:bg-white/10 text-indigo-600 dark:text-indigo-300">
      <Icon size={16} />
    </div>
    <div>
      <div className="font-medium">{title}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300">{children}</div>
    </div>
  </div>
);

const Info = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [showWeights, setShowWeights] = useState(false);
  const [showMock, setShowMock] = useState(false);

  const faqs = [
    { q: "Is IELTSIQ free?", a: "We’re in beta. Core practice is free while premium features (AI feedback, advanced analytics) are in development." },
    { q: "What is the IELTSIQ score?", a: "A single progress number that blends activity, accuracy, and difficulty over time. It’s not an official IELTS band." },
    { q: "Will my progress sync across devices?", a: "Yes—once accounts are enabled, your streaks and sets sync automatically." },
    { q: "How do leaderboards stay fair?", a: "We use timers, accuracy-weighted scoring, and anomaly checks. Friend-only boards are available." },
  ];

  const DIFF_WEIGHTS = [
    { level: "Beginner", w: 0.1 },
    { level: "Easy", w: 0.3 },
    { level: "Medium", w: 0.5 },
    { level: "Hard", w: 0.8 },
    { level: "Extra Hard", w: 1.0 },
  ];

  return (
    <>
      {/* Hero */}
      <Card className="p-0 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <img
            src="https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1600&auto=format&fit=crop"
            alt="Study desk with laptop"
            className="h-56 md:h-full w-full object-cover"
          />
          <div className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-extrabold">Everything about IELTSIQ—in one page.</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              IELTSIQ empowers IELTS learners through gamification, real-world mock exams, typing drills, and smart performance tracking.
            </p>
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              Our mission is to make IELTS prep motivating, measurable, and community-driven.
            </div>
            <div className="mt-4 flex items-center gap-2">
              <PrimaryButton to="/sets">Explore sets</PrimaryButton>
              <PrimaryButton to="/typing" style={{"--btn-bg":"#111827","--btn-fg":"#fff"}}>Try typing</PrimaryButton>
            </div>
          </div>
        </div>
      </Card>

      {/* 1) Mission */}
      <Card title={<div className="flex items-center gap-2"><Target size={16} /><span>Mission of IELTSIQ</span></div>}>
        <div className="grid md:grid-cols-3 gap-4">
          <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop" alt="Team collaboration" className="md:col-span-1 rounded-xl object-cover w-full h-32 md:h-full" />
          <div className="md:col-span-2 grid gap-4">
            <Bullet icon={BookOpen} title="Practice that sticks">Bite-sized tasks, clear levels, and streaks build daily momentum.</Bullet>
            <Bullet icon={Users} title="Learning together">Leaderboards and friend challenges keep motivation high.</Bullet>
            <Bullet icon={Target} title="Fair & Transparent">Accuracy matters more than raw speed. No exploit-y shortcuts.</Bullet>
          </div>
        </div>
      </Card>

      {/* 2) How IELTSIQ works (with scoring) */}
      <Card title={<div className="flex items-center gap-2"><Calculator size={16} /><span>How IELTSIQ works</span></div>}>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <img src="https://images.unsplash.com/photo-1587613865763-4b8b0b88f2c7?q=80&w=1200&auto=format&fit=crop" alt="Scoring visuals" className="rounded-xl object-cover w-full h-32 md:h-40 mb-3" />
            <div className="font-semibold mb-1">Scoring per question</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Each question awards base points by difficulty. Correct answers yield full weight; partially correct tasks (e.g., Writing rubric) scale by feedback score.</p>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-[380px] text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500">
                    <th className="px-2 py-1">Difficulty</th>
                    <th className="px-2 py-1">Weight</th>
                    <th className="px-2 py-1">Example base</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                  {DIFF_WEIGHTS.map((r) => (
                    <tr key={r.level}>
                      <td className="px-2 py-1">{r.level}</td>
                      <td className="px-2 py-1 tabular-nums">{r.w.toFixed(1)}</td>
                      <td className="px-2 py-1 text-gray-500">{r.w} pt</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="mt-3 text-sm underline decoration-dotted" onClick={() => setShowWeights(v => !v)} type="button">
              {showWeights ? "Hide formula" : "Show formula details"}
            </button>
            <Collapse open={showWeights}>
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                <div><span className="font-medium">Question score</span> = baseWeight × correctness (0–1).</div>
                <div className="mt-1"><span className="font-medium">Typing WPM</span> uses <em>accuracy-weighted</em> characters: only correct characters count toward WPM.</div>
                <div className="mt-1"><span className="font-medium">IELTSIQ score</span> = rolling blend of (recent activity × accuracy × difficulty). Older work decays slowly to reward consistency.</div>
              </div>
            </Collapse>
          </div>

          <div>
            <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop" alt="Mock exam" className="rounded-xl object-cover w-full h-32 md:h-40 mb-3" />
            <div className="font-semibold mb-1">CD Mock (computer-delivered)</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">A full IELTS-style mock with timed sections and autosave. Sections: Listening, Reading, Writing (Task 1/2), and Speaking prompts.</p>
            <button className="mt-3 text-sm underline decoration-dotted" onClick={() => setShowMock(v => !v)} type="button">
              {showMock ? "Hide details" : "More about CD Mock"}
            </button>
            <Collapse open={showMock}>
              <ul className="mt-2 list-disc pl-5 text-sm space-y-1 text-gray-700 dark:text-gray-300">
                <li>Auto-timers per part with pause protection.</li>
                <li>Writing receives rubric-based feedback (Task Achievement, Coherence & Cohesion, Lexical Resource, Grammar).</li>
                <li>Review mode with correct answers and explanations for objective items.</li>
              </ul>
            </Collapse>
          </div>
        </div>
      </Card>

      {/* 3) Your progress tools */}
      <Card title={<div className="flex items-center gap-2"><ActivityIcon size={16} /><span>Your progress tools</span></div>}>
        <div className="grid md:grid-cols-3 gap-4">
          <img src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop" alt="Charts" className="rounded-xl object-cover w-full h-32 md:h-full" />
          <div className="md:col-span-2 grid gap-4">
            <Bullet icon={BarChart3} title="IELTSIQ number">One glance metric that rises with steady, accurate work at higher difficulties.</Bullet>
            <Bullet icon={PieChart} title="Type breakdown">See how many Listening/Reading/Writing/Speaking questions you’ve solved.</Bullet>
            <Bullet icon={ActivityIcon} title="Green grid (streak)">GitHub-style heatmap shows daily activity. Darker = more practice that day.</Bullet>
          </div>
        </div>
      </Card>

      {/* 4) FAQ */}
      <Card title={<div className="flex items-center gap-2"><HelpCircle size={16} /><span>Frequently asked questions</span></div>}>
        <div className="divide-y divide-gray-100 dark:divide-white/10">
          {faqs.map((f, i) => (
            <details key={i} className="py-3" open={openFAQ === i} onToggle={(e) => setOpenFAQ(e.target.open ? i : null)}>
              <summary className="cursor-pointer list-none flex items-center justify-between">
                <span className="font-medium">{f.q}</span>
                <ChevronRight className={`transition-transform ${openFAQ === i ? 'rotate-90' : ''}`} size={16} />
              </summary>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{f.a}</div>
            </details>
          ))}
          <details className="py-3">
            <summary className="cursor-pointer list-none flex items-center justify-between">
              <span className="font-medium">How is accuracy calculated in typing?</span>
              <ChevronRight className="transition-transform" size={16} />
            </summary>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">We compare each typed character to the target stream. Only correct characters count toward WPM; mistakes are highlighted in red for reflection.</div>
          </details>
          <details className="py-3">
            <summary className="cursor-pointer list-none flex items-center justify-between">
              <span className="font-medium">Can I retake a set?</span>
              <ChevronRight className="transition-transform" size={16} />
            </summary>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">Yes. Retakes help improve accuracy. Your IELTSIQ rewards recent accurate work more than old attempts.</div>
          </details>
        </div>
      </Card>

      {/* 5) About the team */}
      <Card title={<div className="flex items-center gap-2"><Users size={16} /><span>About the team</span></div>}>
        <div className="grid md:grid-cols-2 gap-4 items-center">
          <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop" alt="Team" className="rounded-xl object-cover w-full h-32 md:h-full" />
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p>IELTSIQ is built by a small, focused team. I lead the project as PM, designer, and senior developer—shipping fast, listening to users, and polishing relentlessly.</p>
            <ul className="mt-3 grid sm:grid-cols-2 gap-3">
              <li className="rounded-xl border border-gray-200 dark:border-white/10 p-3">
                <div className="font-medium">Product & Design</div>
                <div className="text-xs text-gray-500">Flows, UI kits, and usability.</div>
              </li>
              <li className="rounded-xl border border-gray-200 dark:border-white/10 p-3">
                <div className="font-medium">Engineering</div>
                <div className="text-xs text-gray-500">React, routing, performance, and testing.</div>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* 6) Contact */}
      <Card title={<div className="flex items-center gap-2"><Send size={16} /><span>Contact</span></div>}>
        <div className="grid md:grid-cols-2 gap-4 items-center">
          <img src="https://images.unsplash.com/photo-1494172961521-33799ddd43a5?q=80&w=1200&auto=format&fit=crop" alt="Contact" className="rounded-xl object-cover w-full h-32 md:h-full" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Have feedback or want to collaborate? Reach out directly.</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <a href="https://t.me/sheraliyyy" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#229ED9] text-white text-sm shadow hover:opacity-95">
                <Send size={16} /> Telegram
              </a>
              <a href="/info#more" className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white text-gray-900 border border-gray-200 dark:border-white/10 text-sm shadow">
                <ExternalLink size={16} /> More details
              </a>
            </div>
          </div>
        </div>
      </Card>
    </>
  )
}

export default Info
