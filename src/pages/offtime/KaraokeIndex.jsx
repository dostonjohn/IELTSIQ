import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card";
import manifest from "../../data/karaokeManifest.json";

function thumb(id){ return `https://img.youtube.com/vi/${id}/hqdefault.jpg`; }

export default function KaraokeIndex(){
  const [q, setQ] = useState("");
  const videos = (manifest.videos || []).map((v, i) => ({
    ...v,
    _fallbackTitle: `Track ${i+1}`
  }));

  const filtered = useMemo(()=>{
    const s = q.trim().toLowerCase();
    if(!s) return videos;
    return videos.filter(v => {
      const hay = [
        v.id || "",
        v.title || "",
        v.artist || "",
        ...(Array.isArray(v.tags) ? v.tags : [])
      ].join(" ").toLowerCase();
      return hay.includes(s);
    });
  }, [q, videos]);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Karaoke</h1>
          <p className="text-sm text-gray-500 mt-1">Search by title, artist, or tags.</p>
        </div>
        <input
          value={q}
          onChange={e=>setQ(e.target.value)}
          placeholder="Search by title, artist, or tag…"
          className="w-full md:w-[420px] px-3 py-2 rounded-xl border border-gray-300 dark:border-white/10 bg-white/70 dark:bg-white/5 focus:outline-none focus-visible:ring ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {filtered.map((v, idx)=> (
          <Link key={v.id} to={`/off-time/karaoke/${v.id}`} className="group">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gray-200 dark:bg-white/10">
                <img src={thumb(v.id)} alt={v.title || `Karaoke ${idx+1}`} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-2">
                <div className="text-sm font-medium truncate">{v.title || v._fallbackTitle}</div>
                <div className="text-xs text-gray-500 truncate">{v.artist ? v.artist : v.id}</div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}