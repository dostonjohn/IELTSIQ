import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import manifest from '../../../data/listeningEnvironmentManifest.json';
import EnvTasks from '../../../components/listening/EnvTasks';
import EnvResultModal from '../../../components/listening/EnvResultModal';

export default function EnvDetail() {
  const { setId } = useParams();
  const set = manifest.sets.find(s=>s.id===setId);
  const audioRef = useRef(null);
  const [results, setResults] = useState(null);

  const handleSubmit = (answers) => {
    const gapCorrect = set.tasks.gap.answers.map(a=>a.toLowerCase().trim()).includes(answers.gap.toLowerCase().trim());
    const mcqCorrect = parseInt(answers.mcq,10) === set.tasks.mcq.answerIndex;
    const keywordCorrect = parseInt(answers.keyword,10) === set.tasks.keyword.answerIndex;
    setResults({ gap: gapCorrect, mcq: mcqCorrect, keyword: keywordCorrect });
  };

  return (
    <div className="p-4 space-y-4">
      <Link to="/practice/listening/environment" className="text-blue-600">← Back</Link>
      <h1 className="text-2xl font-bold">{set.title}</h1>
      <audio ref={audioRef} controls src={set.audio} className="w-full" />
      <EnvTasks tasks={set.tasks} onSubmit={handleSubmit} />
      <EnvResultModal open={!!results} results={results||{}} transcript={set.tasks.transcript} onClose={()=>setResults(null)} />
    </div>
  );
}
