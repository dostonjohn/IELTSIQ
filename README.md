IELTSIQ

What’s your IELTSIQ?
IELTSIQ is a gamified IELTS preparation platform that makes learning interactive, competitive, and measurable. It combines exam-style question sets, focused practice modes, full computer-delivered mocks, and lightweight well-being tools to keep learners consistent.

Features
Core Modules

Question Sets: All six skill areas (Listening, Reading, Writing, Speaking, Vocabulary, Grammar) across 5 difficulty levels (Beginner, Easy, Medium, Hard, Extra Hard). Scoring with daily streak bonus, global/national/regional/city leaderboards, visual progress (streak grid, pie charts), motivational stats.

Practice Mode:

Listening: 6 modes (Accents, Speed, Multitasking, Spelling, Paraphrasing, Environment/Noise + question types).

Reading: 4 modes (Reading Truly, Reading Paraphrase, Reading Note, Reading Speed).

Vocabulary: Automated quizzes tied to books (e.g., 4000 Essential English Words).

Writing: Paraphrasing, Task 1 big-picture trends, idea generation, letter structure.

Speaking: Record answers with timers.

Grammar: Grammar trainer, Punctuation clinic.

Well-being: Anti-Stress Mode (focus music, breathing timers).

CDMock: Computer-delivered Listening/Reading/Writing with timers, validation, band scoring; based on our CD-Repo integration.

Clips Mode: Scrollable YouTube-embedded shorts; tasks appear after each clip.

Off-time: Mini-games, Karaoke, Mood Mixer.

Notes & Books: Personal notes; vocabulary books integrated into practice.

Tech Stack

Frontend: React, Vite, Tailwind CSS

Backend: Node.js/Express (MoodMixer service)

AI: OpenAI GPT-5 Nano for writing feedback (planned/optional)

Data/Assets: JSON manifests, public audio/video where applicable

Local Development

Node 18+ recommended.

1) Clone and install
git clone https://github.com/<your-username>/ieltsiq.git
cd ieltsiq
npm install

2) Environment variables

Create .env files as needed.

Frontend (.env at repo root or /client if you use a monorepo):

VITE_API_BASE=http://localhost:5175


MoodMixer Backend (/server/.env):

PORT=5175
CORS_ORIGIN=http://localhost:5173
# Optional tuning for search pipeline if used:
# SEARCH_TIMEOUT_MS=8000
# MAX_RESULTS=20


If your project keeps a single .env at the root, include both sets there according to your setup.

3) Start the servers

Open two terminals from the project root (or run them in their respective folders if you split client/server):

Terminal A: start the backend

npm run server


Terminal B: start the frontend

npm run dev


If you have a combined script, you can also run both together (optional):

npm run dev:all

MoodMixer Backend (API)

The MoodMixer feature uses a lightweight Node/Express server that:

Validates candidate audio sources,

Proxies/streams playable audio to the client,

Avoids CORS and content-type issues when mixing multiple ambient tracks.

Endpoints

GET /api/mood/search?q=<keyword>&min=<sec>&max=<sec>&limit=<n>
Returns a list of candidate audio tracks (title, url, duration, attribution flags).

HEAD /api/mood/stream?src=<encodedUrl>
Preflight check that confirms a URL is streamable audio.

GET /api/mood/stream?src=<encodedUrl>
Proxies the actual audio stream to the browser audio element.

Frontend usually calls HEAD /api/mood/stream before adding a track, then uses GET /api/mood/stream for playback. Update VITE_API_BASE to match your backend port.

Scripts (typical)

Your package.json may look like this (adjust if different in your repo):

{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "server": "node server/index.js"
  }
}

Project Structure (example)
ieltsiq/
├─ public/                  # static assets (audio, images, manifests)
├─ src/
│  ├─ pages/                # feature pages (Question Sets, Practice, Mock, Clips, Off-time, Notes, Books)
│  ├─ components/           # shared UI
│  ├─ audio/                # GlobalAudioContext, players, mixers
│  ├─ utils/                # helpers (answer checkers, timers)
│  └─ data/                 # JSON manifests for modes
├─ server/                  # MoodMixer backend (Express)
│  ├─ index.js
│  └─ .env
├─ .env                     # VITE_* vars for frontend
└─ package.json

Troubleshooting

Frontend shows 500 on /api/mood/search or proxy errors (e.g., ENOBUFS):

Make sure the backend is running: npm run server.

Confirm ports match: VITE_API_BASE points to http://localhost:<PORT> from /server/.env.

Check network/DNS stability; the search pipeline may hit multiple hosts.

If you use a dev proxy in Vite, remove it and call the backend via VITE_API_BASE directly.

CORS error:
Set CORS_ORIGIN in /server/.env to your Vite dev origin, e.g. http://localhost:5173.

Audio doesn’t play but no error:
Browser auto-play policies require user gesture. Ensure play is triggered by a click and that your GlobalAudioContext attaches on user input.

Roadmap

 Question sets by skill & level with gamification

 Practice modes (Listening/Reading/Vocabulary/Writing/Speaking/Grammar/Well-being)

 Off-time: Mini-games, Karaoke, Mood Mixer

 Clips Mode with tasks

 Full CDMock polish and scoring dashboards

 AI-based Speaking/Writing auto-feedback

 Competitive 3v3 mode with bans, rounds, live status, leveling

License

MIT