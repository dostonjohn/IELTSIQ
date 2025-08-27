// src/components/audio/MiniPlayer.jsx
import React from 'react'
import { useGlobalAudio } from '../../audio/GlobalAudioContext'
import { Volume2, Pause, Play, Music2, X as CloseIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const MiniPlayer = () => {
  const {
    isRunning,
    tracks,
    ducked,
    pauseAll,
    resumeAll,
    setVolume,
    setLoFi,
    removeTrack,
    userActivated,
    miniDismissed,
    dismissMini
  } = useGlobalAudio()

  const playing = isRunning && tracks.length > 0
  // Only render if user activated at least once, not dismissed, and something is relevant to show
  const shouldShow = userActivated && !miniDismissed && (playing || tracks.length > 0)
  if (!shouldShow) return null

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-md w-[360px] p-3 rounded-xl bg-white/80 dark:bg-[#0b0b0b]/80 backdrop-blur border border-black/10 dark:border-white/10 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Music2 size={18} />
          <span className="text-sm font-medium truncate">Mood Mixer</span>
          {ducked && (
            <span className="text-[10px] text-yellow-500 border border-yellow-600/40 rounded px-1 py-[1px] ml-2">
              ducked
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {playing ? (
            <button
              className="px-2 py-1 rounded border border-gray-500/40 hover:bg-white/10"
              onClick={() => pauseAll()}
              aria-label="Pause"
              title="Pause"
            >
              <Pause size={16} />
            </button>
          ) : (
            <button
              className="px-2 py-1 rounded border border-gray-500/40 hover:bg-white/10"
              onClick={() => resumeAll()}
              aria-label="Play"
              title="Play"
            >
              <Play size={16} />
            </button>
          )}
          <Link
            to="/off-time/mood"
            className="px-2 py-1 rounded border border-gray-500/40 hover:bg-white/10 text-xs"
          >
            Open
          </Link>
          {/* X button to hide the mini-player until next successful playback */}
          <button
            className="px-2 py-1 rounded border border-gray-500/40 hover:bg-white/10"
            onClick={dismissMini}
            aria-label="Close mini player"
            title="Close mini player"
          >
            <CloseIcon size={14} />
          </button>
        </div>
      </div>

      {tracks.length === 0 ? (
        <div className="text-xs text-gray-500">No layers. Add some from the Mood Mixer page.</div>
      ) : (
        <div className="space-y-2 max-h-52 overflow-auto pr-1">
          {tracks.map(t => (
            <div key={t.id} className="text-xs p-2 rounded border border-gray-600/30">
              <div className="flex items-center justify-between gap-2">
                <div className="truncate">{t.title}</div>
                <button
                  onClick={() => removeTrack(t.id)}
                  className="text-[10px] px-1 py-[1px] rounded border border-gray-600/30"
                >
                  remove
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Volume2 size={14} />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  defaultValue={t.volume ?? 0.6}
                  onChange={e => setVolume(t.id, Number(e.target.value))}
                  className="w-full"
                />
                <label className="text-[10px] ml-1">Lo-fi</label>
                <input
                  type="checkbox"
                  defaultChecked={!!t.lofi}
                  onChange={e => setLoFi(t.id, e.target.checked)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MiniPlayer
