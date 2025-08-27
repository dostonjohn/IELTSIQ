import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import MultiResultModal from '../../components/listening/MultiResultModal';
import manifest from '../../data/listeningEnvironmentManifest.json';

function normalize(s){ return (s || '').toLowerCase().trim().replace(/\s+/g,' '); }

export default function ListeningEnvironmentSet(){
  const { setId } = useParams();
  const data = manifest.sets.find(s => s.id === setId) || manifest.sets[0];
  const audioRef = useRef(null);
  const [playedRatio, setPlayedRatio] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  // Task states
  const [gapAns, setGapAns] = useState('');
  const [mcq, setMcq] = useState(null);
  const [keyword, setKeyword] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [results, setResults] = useState([false,false,false]);

  useEffect(()=>{
    const el = audioRef.current;
    if(!el) return;
    const onTime = () => {
      if(el.duration){
        const r = el.currentTime / el.duration;
        setPlayedRatio(r);
        if(r >= 0.7) setUnlocked(true);
      }
    };
    el.addEventListener('timeupdate', onTime);
    return () => el.removeEventListener('timeupdate', onTime);
  }, []);

  const submit = () => {
    const gapOk = data.tasks.gap.answers.map(normalize).includes(normalize(gapAns));
    const mcqOk = mcq === data.tasks.mcq.answerIndex;
    const keywordOk = keyword === data.tasks.keyword.answerIndex;
    setResults([gapOk, mcqOk, keywordOk]);
    setShowModal(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">{data.title}</h2>
          <div className="text-xs text-gray-500">{Math.round((playedRatio||0)*100)}% listened</div>
        </div>
        <Link to="/practice/listening/environment">
          <button className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">All environments</button>
        </Link>
      </div>

      <Card title="Clip">
        <div className="space-y-3">
          <audio ref={audioRef} src={data.audio} controls className="w-full" />
          <p className="text-xs text-gray-500">Tasks will unlock after 70% of the clip is played.</p>
        </div>
      </Card>

      <Card title="Tasks">
        <div className="space-y-4">
          {/* Task 1: Gap fill */}
          <div>
            <div className="text-sm font-medium mb-1">1) Gap fill</div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">{data.tasks.gap.prompt}</div>
            <input
              value={gapAns}
              onChange={e=>setGapAns(e.target.value)}
              disabled={!unlocked}
              className="w-full px-3 py-2 rounded-xl bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10"
              placeholder="Type your answer"
            />
          </div>

          {/* Task 2: MCQ */}
          <div>
            <div className="text-sm font-medium mb-1">2) Multiple choice</div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{data.tasks.mcq.question}</div>
            <div className="grid grid-cols-2 gap-2">
              {data.tasks.mcq.options.map((opt, idx)=>(
                <button
                  key={idx}
                  onClick={()=>setMcq(idx)}
                  disabled={!unlocked}
                  className={`px-3 py-2 rounded-xl border ${mcq===idx ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-500/30' : 'border-gray-200 dark:border-white/10'} text-left`}
                >
                  <span className="text-sm">{opt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Task 3: Keyword spot */}
          <div>
            <div className="text-sm font-medium mb-1">3) Keyword spotting</div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{data.tasks.keyword.question}</div>
            <div className="grid grid-cols-2 gap-2">
              {data.tasks.keyword.options.map((opt, idx)=>(
                <button
                  key={idx}
                  onClick={()=>setKeyword(idx)}
                  disabled={!unlocked}
                  className={`px-3 py-2 rounded-xl border ${keyword===idx ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-500/30' : 'border-gray-200 dark:border-white/10'} text-left`}
                >
                  <span className="text-sm">{opt}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <PrimaryButton disabled={!unlocked} onClick={submit}>Check answers</PrimaryButton>
          </div>
        </div>
      </Card>

      <MultiResultModal
        open={showModal}
        onClose={()=>setShowModal(false)}
        results={results}
        total={3}
        transcript={data.tasks.transcript}
      />
    </div>
  );
}