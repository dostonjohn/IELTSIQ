import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './layout/AppShell'
import Home from './pages/Home'
import Info from './pages/Info'
import Leaderboards from './pages/Leaderboards'
import Sets from './pages/Sets'
import SetPage from './pages/SetPage'
import Typing from './pages/Typing'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Mock from './pages/Mock'
import Logout from './pages/Logout'
import { isValidTo, wpmFrom, countCorrectChars } from './utils'
import PracticeHub from './pages/practice';
import ListeningMenu from './pages/practice/listening';
import ListeningTruly from './pages/practice/listening-truly';
import ListeningContext from './pages/practice/listening-context';
import PracticeReading from './pages/practice/reading';
import PracticeWriting from './pages/practice/writing';
import PracticeSpeaking from './pages/practice/speaking';
import PracticeVocab from './pages/practice/vocabulary';
import PracticeGrammar from './pages/practice/grammar';
import PracticeWellbeing from './pages/practice/wellbeing';
import ComingSoon from './components/ComingSoon';

const App = () => (
  <AppShell>
    <Routes>
      {/* Practice Mode */}
      <Route path="/practice" element={<PracticeHub />} />
      <Route path="/practice/listening" element={<ListeningMenu />} />
      <Route path="/practice/listening/truly" element={<ListeningTruly />} />
      <Route path="/practice/listening/context" element={<ListeningContext />} />
      <Route path="/practice/listening/accents" element={<ComingSoon title="Listening Accents" />} />
      <Route path="/practice/listening/speed" element={<ComingSoon title="Listening Speed" />} />
      <Route path="/practice/listening/multitasking" element={<ComingSoon title="Listening Multitasking" />} />
      <Route path="/practice/listening/spelling" element={<ComingSoon title="Listening Spelling" />} />
      <Route path="/practice/listening/paraphrasing" element={<ComingSoon title="Listening Paraphrasing" />} />
      <Route path="/practice/listening/environment" element={<ComingSoon title="Listening Environment" />} />
      <Route path="/practice/listening/types" element={<ComingSoon title="Listening Question Types" />} />
      <Route path="/practice/reading" element={<PracticeReading />} />
      <Route path="/practice/writing" element={<PracticeWriting />} />
      <Route path="/practice/speaking" element={<PracticeSpeaking />} />
      <Route path="/practice/vocabulary" element={<PracticeVocab />} />
      <Route path="/practice/grammar" element={<PracticeGrammar />} />
      <Route path="/practice/wellbeing" element={<PracticeWellbeing />} />

      <Route path="/" element={<Home />} />
      <Route path="/info" element={<Info />} />
      <Route path="/leaderboards" element={<Leaderboards />} />
      <Route path="/mock" element={<Mock />} />
      <Route path="/sets" element={<Sets />} />
      <Route path="/sets/:slug" element={<SetPage />} />
      <Route path="/typing" element={<Typing />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AppShell>
);

// Dev sanity checks
if (typeof process !== "undefined" && process.env && process.env.NODE_ENV !== "production") {
  console.assert(isValidTo("/mock") === true, "isValidTo should accept '/mock'");
  console.assert(isValidTo("") === false, "isValidTo should reject empty string");
  const w1 = wpmFrom(250, 60000); console.assert(w1 === 50, `Expected 50 WPM, got ${w1}`);
  const _target = "abcdeabcde";
  const _typed = "abcdeXXXXX";
  const correct = countCorrectChars(_target, _typed);
  const w2 = wpmFrom(correct, 60000);
  console.assert(correct === 5 && w2 === 1, `Expected correct=5 & WPM=1, got correct=${correct}, WPM=${w2}`);
}

export default App
