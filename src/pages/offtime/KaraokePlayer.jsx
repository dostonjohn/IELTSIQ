import React, { useMemo } from "react";
import { Link, useParams, useNavigate, Navigate } from "react-router-dom";
import Card from "../../components/Card";
import manifest from "../../data/karaokeManifest.json";

function idxById(list, id){ return Math.max(0, list.findIndex(v=>v.id===id)); }

export default function KaraokePlayer(){
  const { videoId } = useParams();
  const nav = useNavigate();
  const videos = manifest.videos || [];
  const idx = idxById(videos, videoId);
  const current = videos[idx] || videos[0];
  if (!current) return <Navigate to="/off-time/karaoke" replace />;
  const prevId = videos[(idx - 1 + videos.length) % videos.length]?.id;
  const nextId = videos[(idx + 1) % videos.length]?.id;

  const title = current?.title || `Track ${idx+1}`;
  const artist = current?.artist || "";

  const src = useMemo(()=>{
    const id = current?.id || "";
    return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0`;
  }, [current]);

  if(!current) return (
    <div className="space-y-2">
      <p className="text-sm text-red-500">Video not found.</p>
      <Link to="/off-time/karaoke" className="text-indigo-600 underline">Back to list</Link>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">
            {title}{artist ? ` — ${artist}` : ""}
          </h1>
          <p className="text-xs text-gray-500">{current.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/off-time/karaoke" className="px-3 py-2 rounded-xl border border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10">Back</Link>
          <button onClick={()=>nav(`/off-time/karaoke/${prevId}`)} className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20">Prev</button>
          <button onClick={()=>nav(`/off-time/karaoke/${nextId}`)} className="px-3 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">Next</button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="w-full max-w-[70vw] mx-auto">
          <div className="aspect-video">
            <iframe
              src={src}
              title={title}
              className="w-full h-full rounded-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </Card>
    </div>
  );
}
