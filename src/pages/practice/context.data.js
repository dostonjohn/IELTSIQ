export const CONTEXT_ITEMS = [
  {
    id: 'ctx-1',
    title: 'Airport Mixup',
    src: '/audio/sample.wav',
    keywords: [
      ['luggage','baggage','bag'],
      ['airport'],
      ['delay','delayed']
    ],
    mcq: {
      question: 'Where does it happen?',
      options: ['Hotel','Airport','Cafe','Station','Office'],
      answerIndex: 1
    },
    script: 'Speaker describes a luggage delay at the airport. (Demo transcript...)'
  },
  {
    id: 'ctx-2',
    title: 'Weather Alert',
    src: '/audio/sample.wav',
    keywords: [
      ['storm','storms'],
      ['coast','coastal'],
      ['warning','alert']
    ],
    mcq: {
      question: 'What is being announced?',
      options: ['Football match','Weather alert','Concert','Flight deal','School holiday'],
      answerIndex: 1
    },
    script: 'Brief weather update and safety guidance. (Demo transcript...)'
  }
  // Add up to 10 items similarly
];