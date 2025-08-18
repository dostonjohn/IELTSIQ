import React from 'react'

// Small vertical bar used as the typing caret. Accepts a `className` so the
// parent can control the animation. Defaults to a simple blink using
// Tailwind's `animate-pulse`.
const Caret = ({ className = 'animate-pulse' }) => (
  <span
    className={`inline-block w-0.5 h-5 align-[-2px] bg-indigo-600 ${className}`}
    aria-hidden
  />
);

export default Caret
