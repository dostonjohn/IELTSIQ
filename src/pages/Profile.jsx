import React from 'react'
import Card from '../components/Card'
import Pie from '../components/Pie'
import Badge from '../components/Badge'
import Heatmap from '../components/Heatmap'
import { clamp } from '../utils'
import { Star } from 'lucide-react'

const randomHeatmap = (weeks = 20) => {
  return Array.from({ length: weeks }, () =>
    Array.from({ length: 7 }, () => clamp(Math.floor(Math.random() * 5), 0, 4))
  );
};

const Profile = () => {
  const user = {
    name: "Aisha Khan",
    handle: "@aisha",
    country: "UZ",
    city: "Tashkent",
    avatar: "https://i.pravatar.cc/120?img=5",
    ieltsiq: 742,
  };

  const heat = randomHeatmap(20);
  const pieLabels = ["Listening", "Reading", "Writing", "Speaking", "Grammar", "Vocabulary"];
  const pieValues = [32, 28, 12, 18, 20, 15];

  return (
    <>
      <Card>
        <div className="flex items-start gap-4">
          <img src={user.avatar} alt="avatar" className="w-16 h-16 rounded-2xl object-cover" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <span className="text-sm text-gray-500">{user.handle}</span>
            </div>
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">{user.city}, {user.country}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">IELTSIQ</div>
            <div className="text-2xl font-extrabold tabular-nums">{user.ieltsiq}</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card title="Activity (last months)" className="lg:col-span-2">
          <div className="w-full flex justify-center">
            <Heatmap data={heat} startLabel="Older" endLabel="Recent" />
          </div>
        </Card>
        <Card title="Answered questions breakdown">
          <div className="flex items-center gap-4">
            <Pie values={pieValues} labels={pieLabels} />
            <ul className="text-sm space-y-1">
              {pieLabels.map((l, i) => (
                <li key={l} className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: ["#22c55e","#3b82f6","#f59e0b","#ef4444","#8b5cf6","#14b8a6"][i] }} />
                  <span className="w-28">{l}</span>
                  <span className="tabular-nums text-gray-600 dark:text-gray-300">{pieValues[i]}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <Card title="Badges">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Badge label="7-Day Streak" color="#22C55E" icon={Star} />
          <Badge label="100 Questions" color="#3B82F6" />
          <Badge label="Typing 40 WPM" color="#F59E0B" />
        </div>
      </Card>
    </>
  )
}

export default Profile
