// src/data/cdMockSample.js
export const listening = {
  audio: "/audio/sample.wav",
  questions: [
    { id: 1, type: "mcq", text: "What is the main topic discussed?", options: ["University library", "City transport", "Job interview tips", "Healthy diet"], answer: 0 },
    { id: 2, type: "mcq", text: "Which day is the seminar?", options: ["Monday", "Tuesday", "Thursday", "Saturday"], answer: 2 },
    { id: 3, type: "mcq", text: "How long is the session?", options: ["30 minutes", "45 minutes", "60 minutes", "90 minutes"], answer: 2 },
    { id: 4, type: "mcq", text: "Where will it be held?", options: ["Hall A", "Room 204", "Auditorium", "Online"], answer: 1 },
    { id: 5, type: "mcq", text: "What should participants bring?", options: ["ID card", "Notebook", "Laptop", "Printed slides"], answer: 1 },
  ]
};

export const reading = {
  passageTitle: "The Power of Habit in Learning",
  passage: `Developing a learning habit can transform outcomes for language students. Small, consistent practice
  sessions are more effective than occasional long sessions because attention and memory decay over time.
  By revisiting material regularly, learners strengthen neural connections and retain vocabulary and structures
  more efficiently. Gamification elements—streaks, leaderboards, and badges—can provide the motivation
  necessary to maintain consistency without external pressure.`,
  questions: [
    { id: 1, type: "mcq", text: "According to the passage, what is more effective?", options: ["Long weekly sessions", "Short consistent sessions", "Random practice", "Passive listening only"], answer: 1 },
    { id: 2, type: "mcq", text: "What helps maintain motivation?", options: ["Grammar-only drills", "Gamification elements", "Skipping review", "Cramming"], answer: 1 },
    { id: 3, type: "mcq", text: "Why are short sessions better?", options: ["They are more fun", "Memory never decays", "They counter attention/memory decay", "They require no planning"], answer: 2 },
    { id: 4, type: "mcq", text: "Which is *not* mentioned as a benefit?", options: ["Better retention", "Stronger neural connections", "Instant fluency", "Efficient vocabulary learning"], answer: 2 },
    { id: 5, type: "mcq", text: "What is the passage mainly about?", options: ["Exam strategies", "Creating learning habits", "Pronunciation", "Writing essays"], answer: 1 },
  ]
};

export const writing = {
  task1: "Summarize the key information shown in a chart about daily study habits among IELTS candidates.",
  task2: "Some people believe that technology makes learning more effective, while others think it distracts students. Discuss both views and give your own opinion."
};

export const speaking = {
  part1: [
    "Can you introduce yourself ?",
    "Do ypu work or are you a student",
    "Do you prefer studying alone or with others? Why?",
    "How do you usually organize your study time?",
    "What do you like about your studying ?",
    "What do you dislike about your studying ?",
    "Let's talk about animals...Which is you favourite ?",
    "Would you keep wild animal in your home ?"
  ],
  cueCard: `Describe a learning app or website that you find helpful.
  You should say: 
  what it is ? 
  how you use it ? 
  why you find it helpful ?  
  explain how it could be improved ?`,
  part3: [
    "How has technology changed the way people learn languages?",
    "Do you think gamification is always beneficial for learning? Why or why not?",
    "What makes language learning boring ?",
    "What do you think language learning will be essential in the future ?",
    "What makes language learning interesting ?"
  ]
};
