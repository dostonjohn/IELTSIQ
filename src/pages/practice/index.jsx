import React from 'react';
import { Link } from 'react-router-dom';
import PrimaryButton from '../../components/PrimaryButton';
import Card from '../../components/Card';

export default function PracticeHub(){
  return (
    <div className="space-y-4">
      <Card title="Practice Hub">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Choose a skill cluster to practice.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/practice/listening"><PrimaryButton>Listening</PrimaryButton></Link>
          <Link to="/practice/reading"><PrimaryButton>Reading</PrimaryButton></Link>
          <Link to="/practice/writing"><PrimaryButton>Writing</PrimaryButton></Link>
          <Link to="/practice/speaking"><PrimaryButton>Speaking</PrimaryButton></Link>
          <Link to="/practice/vocabulary"><PrimaryButton>Vocabulary</PrimaryButton></Link>
          <Link to="/practice/grammar"><PrimaryButton>Grammar</PrimaryButton></Link>
          <Link to="/practice/wellbeing"><PrimaryButton>Wellbeing</PrimaryButton></Link>
        </div>
      </Card>
    </div>
  );
}