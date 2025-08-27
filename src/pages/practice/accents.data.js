export const ACCENT_OPTIONS = ['American','British','Australian','Canadian','Indian'];

export const ACCENT_GROUPS = [
  {
    id: 'us',
    name: 'American',
    cover: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200&q=80&auto=format&fit=crop',
    clips: [
      {
        src: '/audio/sample.wav',
        title: 'Morning News',
        mcq: { question: 'What is the topic?', options: ['Traffic','Basketball','Concert','Weather','Holiday'], answerIndex: 0 },
        task2: { question: 'One-word answer: main issue is ____', answer: ['congestion','traffic'] },
        task3: { keyword: ['highway'] },
        script: 'Anchor gives a quick commute update with heavy traffic on the highway.'
      },
      {
        src: '/audio/sample.wav',
        title: 'Road Trip',
        mcq: { question: 'Where are they driving?', options: ['Desert','Mountains','Coast','City','Forest'], answerIndex: 2 },
        task2: { question: 'One-word answer: they stop for ____', answer: ['coffee'] },
        task3: { keyword: ['coast'] },
        script: 'Two friends describe a road trip along the coast with a coffee stop.'
      }
    ]
  },
  {
    id: 'uk',
    name: 'British',
    cover: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=1200&q=80&auto=format&fit=crop',
    clips: [
      {
        src: '/audio/sample.wav',
        title: 'Museum Tour',
        mcq: { question: 'What is being described?', options: ['Painting','Sculpture','Fossils','Medieval armor','Coins'], answerIndex: 3 },
        task2: { question: 'One-word answer: item material is ____', answer: ['steel','metal'] },
        task3: { keyword: ['armor'] },
        script: 'A guide explains a set of medieval armor and its restoration.'
      },
      {
        src: '/audio/sample.wav',
        title: 'Campus Update',
        mcq: { question: 'Which building is closed?', options: ['Library','Gym','Cafeteria','Dorm','Lab'], answerIndex: 0 },
        task2: { question: 'One-word answer: library closes for ____', answer: ['repairs','renovation'] },
        task3: { keyword: ['library'] },
        script: 'Student union announces library closure due to repairs.'
      }
    ]
  }
  // Add AU/CA/IN similarly
];