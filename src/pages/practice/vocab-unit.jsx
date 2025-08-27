
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import book1 from '../../data/vocab/book1.json';
import book2 from '../../data/vocab/book2.json';
import book3 from '../../data/vocab/book3.json';
import book4 from '../../data/vocab/book4.json';
import { buildQuiz } from '../../utils/vocabQuiz';
import { setLastScore } from '../../utils/vocabStorage';
import ScoreModal from '../../components/vocab/ScoreModal';

const byId={1:book1,2:book2,3:book3,4:book4};

export default function VocabUnit(){
  const {bookId, unitId} = useParams();
  const navigate = useNavigate();
  const bId = Number(bookId); const uId = Number(unitId);
  const book = byId[bId] || book1;
  const unit = useMemo(()=>book.units.find(u=>u.id===uId) || book.units[0],[book,uId]);
  const [quiz,setQuiz]=useState([]);
  const [cursor,setCursor]=useState(0);
  const [answers,setAnswers]=useState({});
  const [done,setDone]=useState(false);
  const [score,setScore]=useState(0);

  useEffect(()=>{
    const q = buildQuiz(unit);
    setQuiz(q);
    setCursor(0);
    setAnswers({});
    setDone(false);
    setScore(0);
  },[unit]);

  const current = quiz[cursor];
  const total = quiz.length;

  function choose(option){
    setAnswers(a=>({...a, [current.id]: option.text}));
  }

  function next(){
    if(cursor < total-1){ setCursor(c=>c+1); }
    else {
      // submit
      let s=0;
      quiz.forEach(q=>{ if(answers[q.id] === q.answer) s+=1; });
      // include last answer if just chosen and not yet in state (edge case)
      if(answers[current?.id] && answers[current.id] === current.answer) s+=0;
      setScore(s);
      setLastScore(book.book, unit.id, s, total);
      setDone(true);
    }
  }

  if(total===0){
    return (
      <div className="space-y-4">
        <Card title={`Book ${book.book} · Unit ${unit.id}`}>
          <div className="mb-3">
            <Link to={`/practice/vocabulary/book/${book.book}`} className="text-indigo-500 hover:underline">← Back to units</Link>
          </div>
          <div className="rounded-xl border border-yellow-300 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/30 p-4 text-yellow-800 dark:text-yellow-200">
            This unit needs translations (at least 4 Uzbek meanings) before the quiz can start.
          </div>
        </Card>
      </div>
    );
  }

  const selected = current && answers[current.id];
  const progress = Math.round(((cursor)/total)*100);

  return (
    <div className="space-y-4">
      <Card title={`Book ${book.book} · ${unit.title}`}>
        <div className="mb-3 flex items-center justify-between">
          <Link to={`/practice/vocabulary/book/${book.book}`} className="text-indigo-500 hover:underline">← Back to units</Link>
          <div className="text-sm text-gray-600 dark:text-gray-300">Q{cursor+1} of {total}</div>
        </div>
        <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div className="h-full bg-indigo-600" style={{width: `${progress}%`}} />
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
          <div className="mb-3 text-lg text-gray-900 dark:text-white"><span className="rounded bg-indigo-100 dark:bg-indigo-900 px-2 py-1 text-indigo-700 dark:text-indigo-200">UZ</span> <span className="ml-2">{current.promptUz}</span></div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {current.options.map(opt => {
              const isSel = selected === opt.text;
              return (
                <button key={opt.text} onClick={()=>choose(opt)} className={`rounded-xl border px-4 py-3 text-left transition
                  ${isSel ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-500'} text-gray-900 dark:text-gray-100`}>
                  {opt.text}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex justify-end">
            <button onClick={next} disabled={!selected} className={`rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 ${selected? 'bg-indigo-600 hover:bg-indigo-500':'bg-gray-500 cursor-not-allowed'}`}>Next</button>
          </div>
        </div>
      </Card>

      <ScoreModal open={done} score={score} total={total} onClose={()=>setDone(false)} onRetry={()=>{
        const q = buildQuiz(unit); setQuiz(q); setCursor(0); setAnswers({}); setDone(false); setScore(0);
      }} onBackToUnits={()=>navigate(`/practice/vocabulary/book/${book.book}`)} />
    </div>
  );
}
