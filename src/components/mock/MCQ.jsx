// src/components/mock/MCQ.jsx
import React from 'react';
export default function MCQ({ q, value, onChange, index }){
  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3">
      <div className="font-medium">{index+1}. {q.text}</div>
      <div className="mt-2 grid gap-2">
        {q.options.map((opt,i)=>(
          <label key={i} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${value===i?'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10':'border-gray-200 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10'}`}>
            <input type="radio" name={`q-${q.id}`} className="sr-only" checked={value===i} onChange={()=>onChange(i)} />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
