import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PrimaryButton from "../../../components/PrimaryButton";

const SIZE = 4;

function emptyBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function randomSpawn(board) {
  const empty = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!board[r][c]) empty.push([r, c]);
    }
  }
  if (!empty.length) return board;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
  return board;
}

function clone(b) {
  return b.map(row => row.slice());
}

// returns { line, gain }
function compressMerge(line) {
  const arr = line.filter(x => x);
  let gain = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      gain += arr[i];   // add merged value to score
      arr.splice(i + 1, 1);
    }
  }
  while (arr.length < SIZE) arr.push(0);
  return { line: arr, gain };
}

// returns { board, moved, gain }
function move(board, dir) {
  const b = clone(board);
  let moved = false, gain = 0;

  const apply = (getter, setter) => {
    for (let i = 0; i < SIZE; i++) {
      const line = [];
      for (let j = 0; j < SIZE; j++) line.push(getter(i, j));
      const before = line.join(",");
      const { line: merged, gain: g } = compressMerge(line);
      gain += g;
      if (merged.join(",") !== before) moved = true;
      for (let j = 0; j < SIZE; j++) setter(i, j, merged[j]);
    }
  };

  if (dir === "left") {
    apply((r, c) => b[r][c], (r, c, v) => (b[r][c] = v));
  } else if (dir === "right") {
    apply((r, c) => b[r][SIZE - 1 - c], (r, c, v) => (b[r][SIZE - 1 - c] = v));
  } else if (dir === "up") {
    apply((r, c) => b[c][r], (r, c, v) => (b[c][r] = v));
  } else if (dir === "down") {
    apply((r, c) => b[SIZE - 1 - c][r], (r, c, v) => (b[SIZE - 1 - c][r] = v));
  }
  return { board: b, moved, gain };
}

function anyMoves(board) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = board[r][c];
      if (!v) return true;
      if (r + 1 < SIZE && board[r + 1][c] === v) return true;
      if (c + 1 < SIZE && board[r][c + 1] === v) return true;
    }
  }
  return false;
}

function useSwipe(onDir) {
  useEffect(() => {
    let sx = 0, sy = 0;
    const onStart = e => {
      const t = e.touches[0];
      sx = t.clientX;
      sy = t.clientY;
    };
    const onEnd = e => {
      const t = e.changedTouches[0];
      const dx = t.clientX - sx,
        dy = t.clientY - sy;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
      if (Math.abs(dx) > Math.abs(dy)) onDir(dx > 0 ? "right" : "left");
      else onDir(dy > 0 ? "down" : "up");
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [onDir]);
}

export default function Game2048() {
  const [board, setBoard] = useState(() =>
    randomSpawn(randomSpawn(emptyBoard()))
  );
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(
    () => parseInt(localStorage.getItem("g2048Best") || "0", 10)
  );
  const [over, setOver] = useState(false);

  const reset = () => {
    setBoard(randomSpawn(randomSpawn(emptyBoard())));
    setScore(0);
    setOver(false);
  };

  const doMove = dir => {
    if (over) return;
    const { board: nb, moved, gain } = move(board, dir);
    if (!moved) return;
    const newScore = score + gain;
    setScore(newScore);
    randomSpawn(nb);
    setBoard(nb);
    if (!anyMoves(nb)) {
      setOver(true);
      setBest(b => {
        const nb2 = Math.max(b, newScore);
        localStorage.setItem("g2048Best", String(nb2));
        return nb2;
      });
    }
  };

  // Keyboard
  useEffect(() => {
    const onKey = e => {
      if (e.key === "ArrowLeft") doMove("left");
      else if (e.key === "ArrowRight") doMove("right");
      else if (e.key === "ArrowUp") doMove("up");
      else if (e.key === "ArrowDown") doMove("down");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [board, over, score]);

  // Swipe
  useSwipe(doMove);

  return (
    <div className="p-6 flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">2048</h2>
        <span className="text-sm text-gray-500">
          Score {score} · Best {best}
        </span>
      </div>
      <div className="p-3 rounded-lg bg-gray-100 dark:bg-white/10">
        <div className="grid grid-cols-4 gap-2">
          {board.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={r + "-" + c}
                className="w-16 h-16 flex items-center justify-center rounded-lg bg-white dark:bg-white/10 text-lg font-bold"
              >
                {cell || ""}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex gap-3">
        <PrimaryButton onClick={reset}>
          {over ? "Try again" : "Restart"}
        </PrimaryButton>
        <PrimaryButton variant="ghost" as="button">
          <Link to="/off-time/minigames" className="underline">
            Back
          </Link>
        </PrimaryButton>
      </div>
    </div>
  );
}
