import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PrimaryButton from "../../../components/PrimaryButton";

const CELL = 20;
const GRID = 20; // 20x20
const TICK_MS = 110;

function randCell() {
  return { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
}

export default function SnakeGame() {
  const canvasRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [food, setFood] = useState(randCell());
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem("snakeBest") || "0", 10));

  const reset = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDir({ x: 1, y: 0 });
    setFood(randCell());
    setScore(0);
    setRunning(true);
  };

  // Keyboard controls
  useEffect(() => {
    const onKey = e => {
      if (e.key === "ArrowUp" && dir.y === 0) setDir({ x: 0, y: -1 });
      else if (e.key === "ArrowDown" && dir.y === 0) setDir({ x: 0, y: 1 });
      else if (e.key === "ArrowLeft" && dir.x === 0) setDir({ x: -1, y: 0 });
      else if (e.key === "ArrowRight" && dir.x === 0) setDir({ x: 1, y: 0 });
      else if (e.key === " " && running) setRunning(false);
      else if (e.key === " " && !running && score > 0) setRunning(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dir, running, score]);

  // Touch controls (simple swipe)
  useEffect(() => {
    let startX = 0, startY = 0;
    const area = canvasRef.current;
    if (!area) return;
    const onStart = e => {
      const t = e.touches[0];
      startX = t.clientX; startY = t.clientY;
    };
    const onMove = e => {
      if (!startX && !startY) return;
      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > 24 || Math.abs(dy) > 24) {
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 0 && dir.x === 0) setDir({ x: 1, y: 0 });
          else if (dx < 0 && dir.x === 0) setDir({ x: -1, y: 0 });
        } else {
          if (dy > 0 && dir.y === 0) setDir({ x: 0, y: 1 });
          else if (dy < 0 && dir.y === 0) setDir({ x: 0, y: -1 });
        }
        startX = 0; startY = 0;
      }
    };
    area.addEventListener("touchstart", onStart, { passive: true });
    area.addEventListener("touchmove", onMove, { passive: true });
    return () => {
      area.removeEventListener("touchstart", onStart);
      area.removeEventListener("touchmove", onMove);
    };
  }, [dir]);

  // Game loop
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSnake(prev => {
        const head = { ...prev[0] };
        head.x += dir.x; head.y += dir.y;

        // Wrap walls
        if (head.x < 0) head.x = GRID - 1;
        if (head.x >= GRID) head.x = 0;
        if (head.y < 0) head.y = GRID - 1;
        if (head.y >= GRID) head.y = 0;

        // Self collision
        if (prev.some(seg => seg.x === head.x && seg.y === head.y)) {
          setRunning(false);
          setBest(b => {
            const nb = Math.max(b, score);
            localStorage.setItem("snakeBest", String(nb));
            return nb;
          });
          return prev;
        }

        const newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 1);
          setFood(randCell());
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [running, dir, food, score]);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, GRID * CELL, GRID * CELL);
    // food
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);
    // snake
    ctx.fillStyle = "#22c55e";
    snake.forEach((seg, i) => {
      ctx.globalAlpha = i === 0 ? 1 : 0.9;
      ctx.fillRect(seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4);
    });
    ctx.globalAlpha = 1;
  }, [snake, food]);

  return (
    <div className="p-6 flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">Snake</h2>
        <span className="text-sm text-gray-500">Score {score} · Best {best}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={GRID * CELL}
        height={GRID * CELL}
        className="border border-gray-300 rounded-lg touch-none"
      />
      <div className="flex gap-3">
        {!running ? (
          <PrimaryButton onClick={reset}>Start</PrimaryButton>
        ) : (
          <PrimaryButton onClick={() => setRunning(false)}>Pause</PrimaryButton>
        )}
        <PrimaryButton variant="ghost" as="button">
          <Link to="/off-time/minigames" className="underline">Back</Link>
        </PrimaryButton>
      </div>
    </div>
  );
}
