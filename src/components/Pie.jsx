import React from 'react'
import { sum } from '../utils'

const Pie = ({ values = [], labels = [] }) => {
  const total = Math.max(1, sum(values));
  let acc = 0;
  const radius = 42;
  const circ = 2 * Math.PI * radius;
  return (
    <svg viewBox="0 0 100 100" className="w-28 h-28">
      <circle cx="50" cy="50" r={radius} fill="transparent" stroke="rgba(0,0,0,0.08)" strokeWidth="12" />
      {values.map((v, i) => {
        const portion = v / total;
        const dash = portion * circ;
        const gap = circ - dash;
        const rot = (acc / total) * 360; acc += v;
        const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];
        return (
          <circle
            key={i}
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={colors[i % colors.length]}
            strokeWidth="12"
            strokeDasharray={`${dash} ${gap}`}
            transform={`rotate(-90 50 50) rotate(${rot} 50 50)`}
          />
        );
      })}
    </svg>
  );
};

export default Pie
