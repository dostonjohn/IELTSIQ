import { useEffect, useRef, useState } from "react";

export function useAudioSequencer(tracks) {
  const audioRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSection, setCurrentSection] = useState(tracks[0]?.sectionId ?? 1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = new Audio();
    audioRef.current = el;
    const onEnded = () => {
      setIdx((i) => {
        const next = i + 1;
        if (next >= tracks.length) {
          setDone(true);
          setIsPlaying(false);
          return i;
        }
        setCurrentSection(tracks[next].sectionId);
        el.src = tracks[next].src;
        void el.play().catch(() => {});
        return next;
      });
    };
    el.addEventListener("ended", onEnded);
    if (tracks[0]) el.src = tracks[0].src;
    return () => {
      el.pause();
      el.src = "";
      el.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, [tracks]);

  const play = async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {}
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const startFrom = async (index) => {
    setIdx(index);
    setCurrentSection(tracks[index]?.sectionId ?? 1);
    if (!audioRef.current) return;
    audioRef.current.src = tracks[index]?.src ?? "";
    await play();
  };

  return { idx, isPlaying, play, pause, startFrom, currentSection, done };
}
