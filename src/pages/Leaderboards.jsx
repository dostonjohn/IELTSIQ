import React, { useState } from 'react'
import { Globe, Flag, MapPin, Users } from 'lucide-react'
import Card from '../components/Card'

const Leaderboards = () => {
  const [tab, setTab] = useState("world");

  const FilterChip = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setTab(id)}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm border transition-colors ${
        tab === id ? "bg-indigo-600 text-white border-indigo-600" : "bg-white/70 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
      }`}
      type="button"
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <Card title="The numbers speak for themselves.">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <FilterChip id="world" icon={Globe} label="Worldwide" />
        <FilterChip id="country" icon={Flag} label="Country" />
        <FilterChip id="city" icon={MapPin} label="City" />
        <FilterChip id="friends" icon={Users} label="Friends" />
      </div>

      {tab === "friends" ? (
        <div className="rounded-xl border border-gray-200 dark:border-white/10 divide-y divide-gray-100 dark:divide-white/10">
          {[
            { place: 1, name: "Aisha", score: 742, img: 5, color: "text-yellow-600" },
            { place: 2, name: "Doston", score: 731, img: 8, color: "text-gray-400" },
            { place: 3, name: "Layla", score: 720, img: 12, color: "text-[color:#CD7F32]" },
          ].map(({ place, name, score, img, color }) => (
            <div key={place} className="flex items-center gap-3 p-2">
              <span className="w-6 text-center font-semibold">{place}</span>
              <img src={`https://i.pravatar.cc/48?img=${img}`} alt={`${name} avatar`} className="w-8 h-8 rounded-full object-cover" />
              <span className={`flex-1 font-medium ${color}`}>{name}</span>
              <span className="text-sm font-semibold tabular-nums min-w-[72px] text-right">{score}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="rounded-xl border border-gray-200 dark:border-white/10 divide-y divide-gray-100 dark:divide-white/10 min-w=[560px]">
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2 py-2 text-xs font-medium text-gray-500">
              <div className="px-3 md:px-4">#</div>
              <div className="col-span-2 md:col-span-2 px-3 md:px-4">User</div>
              <div className="hidden md:block px-3 md:px-4">Country</div>
              <div className="hidden md:block px-3 md:px-4">City</div>
              <div className="px-3 md:px-4 text-right min-w-[72px]">IELTSIQ</div>
            </div>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="grid grid-cols-4 md:grid-cols-6 gap-2 py-2 items-center text-sm">
                <div className="px-3 md:px-4 text-gray-500">#{i + 1}</div>
                <div className="col-span-2 md:col-span-2 px-3 md:px-4 font-medium">User {i + 1}</div>
                <div className="hidden md:block px-3 md:px-4">UZ</div>
                <div className="hidden md:block px-3 md:px-4">Tashkent</div>
                <div className="px-3 md:px-4 text-right tabular-nums min-w-[72px]">{700 - i * 8}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

export default Leaderboards
