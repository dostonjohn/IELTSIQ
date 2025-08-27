import React from 'react';
import Card from '../components/Card';

export default function Books(){
  return (
    <div className="space-y-4">
      <Card title="IELTS Books">
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li><span className="font-medium">Cambridge IELTS Series</span> — authentic past papers.</li>
          <li><span className="font-medium">The Official Cambridge Guide</span> — comprehensive strategies.</li>
          <li><span className="font-medium">Grammar for IELTS</span> — build accurate grammar.</li>
          <li><span className="font-medium">Vocabulary for IELTS</span> — improve topic vocabulary.</li>
        </ul>
      </Card>
    </div>
  );
}