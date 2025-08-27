import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import AppShell from './layout/AppShell'
import { GlobalAudioProvider } from './audio/GlobalAudioContext'
import FocusGate from './layout/FocusGate'

// Core pages
import OffTime from './pages/OffTime'
import KaraokeIndex from './pages/offtime/KaraokeIndex'
import KaraokePlayer from './pages/offtime/KaraokePlayer'
import MoodMixer from './pages/offtime/MoodMixer'
import Game2048 from './pages/offtime/minigames/Game2048'
import SnakeGame from './pages/offtime/minigames/SnakeGame'
import MiniGamesIndex from './pages/offtime/minigames/MiniGamesIndex'

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
import Notes from './pages/Notes'

// Utils
import { isValidTo, wpmFrom, countCorrectChars } from './utils'

// Practice hub
import PracticeHub from './pages/practice'

// Listening cluster
import ListeningMenu from './pages/practice/listening'
import ListeningTruly from './pages/practice/listening-truly'
import ListeningContext from './pages/practice/listening-context'
import ListeningAccents from './pages/practice/listening-accents'
import ListeningSpeed from './pages/practice/listening-speed'
import ListeningMultitasking from './pages/practice/listening-multitasking'
import ListeningMultitaskingSet from './pages/practice/listening-multitasking-set'
import ListeningEnvironmentIndex from './pages/practice/listening-environment'
import ListeningEnvironmentSet from './pages/practice/listening-environment-set'

// Listening: Spelling
import ListeningSpelling from './pages/practice/listening-spelling'
import ListeningSpellingWord from './pages/practice/listening-spelling-word'
import ListeningSpellingBank from './pages/practice/listening-spelling-bank'

// Listening: Paraphrasing
import ParaphraseIndex from './pages/practice/listening/ParaphraseIndex'
import ParaphraseSet from './pages/practice/listening/ParaphraseSet'

// Reading cluster
import ReadingMenu from './pages/practice/reading'
import ReadingTrulyIndex from './pages/practice/reading-truly'
import TrulyTopic from './pages/practice/reading/TrulyTopic'
import TrulyArticle from './pages/practice/reading/TrulyArticle'
import ReadingSpeedNote from './pages/practice/reading-speednote'

import Vocabulary from './pages/practice/vocabulary'
import VocabBook from './pages/practice/vocab-book'
import VocabUnit from './pages/practice/vocab-unit'

// Reading: Paraphrase (new)
import ReadingParaphraseIndex from './pages/practice/reading/ParaphraseIndex'
import SentenceMode from './pages/practice/reading/SentenceMode'
import ParagraphMode from './pages/practice/reading/ParagraphMode'
import PassageMode from './pages/practice/reading/PassageMode'

// Misc pages
import Books from './pages/Books'
import Clips from './pages/Clips'

const App = () => (
  <GlobalAudioProvider>
  <AppShell>
    <Routes>
      {/* Practice hub */}
      <Route path="/practice" element={<PracticeHub />} />

      {/* Listening */}
      <Route path="/practice/listening" element={<ListeningMenu />} />
      <Route path="/practice/listening/truly" element={<ListeningTruly />} />
      <Route path="/practice/listening/context" element={<ListeningContext />} />
      <Route path="/practice/listening/accents" element={<ListeningAccents />} />
      <Route path="/practice/listening/speed" element={<ListeningSpeed />} />
      <Route path="/practice/listening/multitasking" element={<ListeningMultitasking />} />
      <Route path="/practice/listening/multitasking/set/:setId" element={<ListeningMultitaskingSet />} />
      <Route path="/practice/listening/environment" element={<ListeningEnvironmentIndex />} />
      <Route path="/practice/listening/environment/:setId" element={<ListeningEnvironmentSet />} />

      {/* Listening: Spelling */}
      <Route path="/practice/listening/spelling" element={<ListeningSpelling />} />
      <Route path="/practice/listening/spelling/word" element={<ListeningSpellingWord />} />
      <Route path="/practice/listening/spelling/:bank" element={<ListeningSpellingBank />} />

      {/* Listening: Paraphrasing */}
      <Route path="/practice/listening/paraphrase" element={<ParaphraseIndex />} />
      <Route path="/practice/listening/paraphrase/:setId" element={<ParaphraseSet />} />

      {/* Misc */}
      <Route path="/clips" element={<Clips />} />
      <Route path="/books" element={<Books />} />

      {/* Core pages */}
      <Route path="/" element={<Home />} />
      <Route path="/info" element={<Info />} />
      <Route path="/leaderboards" element={<Leaderboards />} />
      <Route path="/mock" element={<Mock />} />
      <Route path="/sets" element={<Sets />} />
      <Route path="/sets/:slug" element={<SetPage />} />
      <Route path="/typing" element={<Typing />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/logout" element={<Logout />} />


      {/* Off Time */}
      <Route path="/off-time" element={<OffTime />} />
      <Route path="/off-time/karaoke" element={<KaraokeIndex />} />
      <Route path="/off-time/karaoke/:videoId" element={<KaraokePlayer />} />
      <Route path="/off-time/mood" element={<MoodMixer />} />
      \1

      {/* Reading */}
      <Route path="/practice/reading" element={<ReadingMenu />} />
      <Route path="/practice/reading/truly" element={<ReadingTrulyIndex />} />
      <Route path="/practice/reading/truly/:topicId" element={<TrulyTopic />} />
      <Route path="/practice/reading/truly/:topicId/:articleIdx" element={<TrulyArticle />} />

      {/* Vocabulary */}
      <Route path="/practice/vocabulary" element={<Vocabulary />} />
      <Route path="/practice/vocabulary/book/:bookId" element={<VocabBook />} />
      <Route path="/practice/vocabulary/book/:bookId/unit/:unitId" element={<VocabUnit />} />

      {/* Reading: Paraphrase */}
      <Route path="/practice/reading/paraphrase" element={<ReadingParaphraseIndex />} />
      <Route path="/practice/reading/paraphrase/sentence" element={<SentenceMode />} />
      <Route path="/practice/reading/paraphrase/paragraph" element={<ParagraphMode />} />
      <Route path="/practice/reading/paraphrase/passage" element={<PassageMode />} />
      <Route path="/practice/reading/speed-note" element={<ReadingSpeedNote />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    
        <Route path="/off-time/minigames" element={<MiniGamesIndex />} />
        <Route path="/off-time/minigames/snake" element={<SnakeGame />} />
        <Route path="/off-time/minigames/2048" element={<Game2048 />} />
    
</Routes>
  </AppShell>
  </GlobalAudioProvider>
)


export default App

