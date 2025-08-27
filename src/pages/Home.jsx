import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Users, Keyboard, ChevronRight } from 'lucide-react'
import Card from '../components/Card'
import PrimaryButton from '../components/PrimaryButton'

const Home = () => (
  <>
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">IELTS prep that feels like a game.</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Practice across all four skills with leveled challenges, streaks, and instant feedback. Compete on leaderboards and watch your IELTSIQ climb.
          </p>
          <div className="mt-5">
            <Link to="/info" className="inline-flex items-center text-sm font-medium underline decoration-dotted">
              How it works <ChevronRight className="ml-1" size={16} />
            </Link>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1200&auto=format&fit=crop"
            alt="Student practicing for IELTS on a laptop with notes"
            className="w-full h-[260px] md:h-[300px] object-cover rounded-2xl"
          />
          <div className="absolute -bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[280px] rounded-2xl border border-gray-200 dark:border-white/10 bg-white/90 dark:bg-[#0B0D12]/90 backdrop-blur p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">Featured</p>
                <h3 className="text-base font-semibold">Full CD IELTS Mock</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">Reading • Listening • Writing • Speaking</p>
              </div>
              <FileText className="shrink-0" size={22} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-gray-500">~ 2 hrs • Timed</p>
              <PrimaryButton to="/mock" className="px-3 py-1 text-xs" disabled title="Coming soon">Start mock</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <Card title="Question sets">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-stretch">
        {[
          { t: "Listening", icon: "🎧" },
          { t: "Reading", icon: "📖" },
          { t: "Writing", icon: "✍️" },
          { t: "Speaking", icon: "🎤" },
          { t: "Grammar", icon: "🧩" },
          { t: "Vocabulary", icon: "🗂️" },
          { t: "Mixed Set", icon: "🌀" },
        ].map(({ t, icon }, idx, arr) => (
          <div key={t} className={`rounded-xl border border-gray-200 dark:border-white/10 p-4 flex flex-col items-center text-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${idx === arr.length - 1 ? "lg:col-span-3" : ""}`}>
            <div className="text-3xl mb-2" aria-hidden>{icon}</div>
            <h4 className="font-semibold">{t}</h4>
          </div>
        ))}
      </div>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <Card title={<div className="flex items-center gap-2"><span role="img" aria-label="lightbulb">💡</span><span>Tip of the Day</span></div>}>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          When preparing for the IELTS Speaking test, practice speaking on everyday topics for 2 minutes without stopping. This builds fluency and confidence under timed conditions.
        </p>
      </Card>

      <Card title={<div className="flex items-center gap-2"><Users size={16} /><span>Friends Leaderboard</span></div>}>
        <ul className="divide-y divide-gray-100 dark:divide-white/10">
          <li className="flex items-center gap-3 py-2"><span className="w-6 text-center font-semibold">1</span><img src="https://i.pravatar.cc/48?img=5" alt="Aisha" className="w-8 h-8 rounded-full object-cover" /><span className="flex-1 font-medium text-yellow-600">Aisha</span><span className="text-sm font-semibold tabular-nums min-w-[72px] text-right">742</span></li>
          <li className="flex items-center gap-3 py-2"><span className="w-6 text-center font-semibold">2</span><img src="https://i.pravatar.cc/48?img=8" alt="Doston" className="w-8 h-8 rounded-full object-cover" /><span className="flex-1 font-medium text-gray-400">Doston</span><span className="text-sm font-semibold tabular-nums min-w-[72px] text-right">731</span></li>
          <li className="flex items-center gap-3 py-2"><span className="w-6 text-center font-semibold">3</span><img src="https://i.pravatar.cc/48?img=12" alt="Layla" className="w-8 h-8 rounded-full object-cover" /><span className="flex-1 font-medium" style={{ color: "#CD7F32" }}>Layla</span><span className="text-sm font-semibold tabular-nums min-w-[72px] text-right">720</span></li>
        </ul>
        <div className="mt-3 flex gap-2">
          <PrimaryButton className="px-3 py-1 text-xs" to="/friends" disabled title="Coming soon">View all friends</PrimaryButton>
          <PrimaryButton className="px-3 py-1 text-xs" to="/friends/add" disabled title="Coming soon">Add friend</PrimaryButton>
        </div>
      </Card>

      <Card title={<div className="flex items-center gap-2"><Keyboard size={16} /><span>Typing speed</span></div>}>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Practice and improve your writing pace. Aim for a steady 30-40 words per minute with clear structure and minimal backspacing. Short, 2-3 minute bursts help build speed without sacrificing accuracy.
        </p>
        <div className="mt-3">
          <PrimaryButton className="px-3 py-1 text-xs" to="/typing" disabled title="Coming soon">Start</PrimaryButton>
        </div>
      </Card>
    </div>
  </>
)

export default Home
