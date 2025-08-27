import React, { useState } from 'react';

export default function EnvTasks({ tasks, onSubmit }) {
  const [gap, setGap] = useState('');
  const [mcq, setMcq] = useState(null);
  const [keyword, setKeyword] = useState(null);

  const handleSubmit = () => {
    onSubmit({ gap, mcq, keyword });
  };

  return (
    <div className="space-y-4">
      <div>
        <p>{tasks.gap.prompt}</p>
        <input className="border p-1" value={gap} onChange={e=>setGap(e.target.value)} />
      </div>
      <div>
        <p>{tasks.mcq.question}</p>
        {tasks.mcq.options.map((opt,i)=>(
          <label key={i} className="block">
            <input type="radio" name="mcq" value={i} onChange={()=>setMcq(i)} /> {opt}
          </label>
        ))}
      </div>
      <div>
        <p>{tasks.keyword.question}</p>
        {tasks.keyword.options.map((opt,i)=>(
          <label key={i} className="block">
            <input type="radio" name="keyword" value={i} onChange={()=>setKeyword(i)} /> {opt}
          </label>
        ))}
      </div>
      <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={handleSubmit}>Check answers</button>
    </div>
  );
}
