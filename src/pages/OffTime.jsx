import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import ComingSoon from "../components/ComingSoon";

export default function OffTime() {
  const cards = [
  { key: "karaoke", title: "Karaoke", desc: "Sing with clean lyrics on screen.", to: "/off-time/karaoke", disabled: false },
  { key: "mood", title: "Mood Mixer", desc: "Mix ambient sounds for your study vibe.", to: "/off-time/mood", disabled: false },
  { key: "games", title: "Mini‑games", desc: "Snake and 2048. Quick, light fun.", to: "/off-time/minigames", disabled: false }
];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">Off Time</h1>
        <p className="text-sm text-gray-500 mt-1">A calm corner inside IELTSIQ.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(c => (
          <Card key={c.key} className={"p-4 " + (c.disabled ? "opacity-70" : "")}>
            <div className="flex flex-col gap-2">
              <div className="text-lg font-medium">{c.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{c.desc}</div>
              {!c.disabled ? (
                <Link to={c.to} className="inline-flex mt-2 items-center justify-center px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring ring-indigo-500">
                  Open
                </Link>
              ) : (
                <div className="mt-2">
                  <ComingSoon />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
