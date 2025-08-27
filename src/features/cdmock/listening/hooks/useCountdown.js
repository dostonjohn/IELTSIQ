import { useEffect, useRef, useState } from "react";

export function useCountdown(seconds) {
  const [remaining, setRemaining] = useState(seconds);
  const timerRef = useRef(null);

  useEffect(() => {
    setRemaining(seconds);
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [seconds]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  return { remaining, label: `${mm}:${ss}` };
}
