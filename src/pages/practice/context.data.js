// src/pages/practice/context.data.js
export const CONTEXT_ITEMS = [
  {
    id: 'ctx-1',
    title: 'Airport Mixup',
    src: '/audio/sample.wav',
    keywords: [['luggage','bag','baggage'], ['airport'], ['delay','delayed']],
    mcq: { question: 'Where does the story happen?', options: ['Hotel','Airport','Cafe','Station','Office'], answerIndex: 1 },
    script: 'I arrived at the airport only to find my luggage missing. After speaking with staff, I learned it had been delayed and would arrive on the next flight. I filled out a form and waited near the desk...'
  },
  {
    id: 'ctx-2',
    title: 'City Detour',
    src: '/audio/sample.wav',
    keywords: [['bus'], ['bridge'], ['detour','reroute']],
    mcq: { question: 'Why was the route changed?', options: ['Accident','Festival','Bridge repair','Weather','Parade'], answerIndex: 2 },
    script: 'The bus driver announced a detour because the main bridge was closed for repairs. Passengers checked their phones and the driver explained the new route would add ten minutes to the journey...'
  },
  {
    id: 'ctx-3',
    title: 'Market Haggling',
    src: '/audio/sample.wav',
    keywords: [['discount','deal'], ['seller','vendor'], ['cash']],
    mcq: { question: 'How does the buyer pay?', options: ['Cash','Card','Transfer','Voucher','Points'], answerIndex: 0 },
    script: 'At the weekend market, the buyer asked for a small discount. The vendor smiled and offered a better price if the buyer paid in cash, avoiding the card fee. They shook hands on the deal...'
  },
  {
    id: 'ctx-4',
    title: 'Late Delivery',
    src: '/audio/sample.wav',
    keywords: [['package','parcel'], ['address'], ['traffic']],
    mcq: { question: 'What caused the delay?', options: ['Weather','Traffic','Wrong address','Customs','Holiday'], answerIndex: 1 },
    script: 'The courier apologized for the late package and explained heavy traffic on the ring road. He confirmed the address and asked for a quick signature before heading to the next stop...'
  },
  {
    id: 'ctx-5',
    title: 'Exam Nerves',
    src: '/audio/sample.wav',
    keywords: [['notes'], ['timer','clock'], ['calm','relax']],
    mcq: { question: 'What helped the speaker focus?', options: ['Music','Coffee','Deep breaths','Chewing gum','Standing'], answerIndex: 2 },
    script: 'Before the exam, the student reviewed short notes and practiced deep breathing. Hearing the timer start made them nervous, but steady breaths helped them relax and focus on the first section...'
  },
  {
    id: 'ctx-6',
    title: 'Gym Routine',
    src: '/audio/sample.wav',
    keywords: [['trainer','coach'], ['warmup','warm-up'], ['stretch']],
    mcq: { question: 'What did the trainer stress first?', options: ['Weights','Warm-up','Running','Diet','Sleep'], answerIndex: 1 },
    script: 'The coach explained the routine: start with a proper warm-up, then light weights, and finish with stretching. Consistency matters more than intensity for beginners, the trainer added...'
  },
  {
    id: 'ctx-7',
    title: 'Café Order',
    src: '/audio/sample.wav',
    keywords: [['latte','coffee'], ['almond','soy'], ['sugar','syrup']],
    mcq: { question: 'What milk was chosen?', options: ['Whole','Skim','Soy','Oat','Almond'], answerIndex: 4 },
    script: 'At the café, the customer ordered a latte with almond milk and a dash of vanilla syrup. The barista repeated the order, suggested a pastry, and prepared the drink while chatting...'
  },
  {
    id: 'ctx-8',
    title: 'Flat Tire',
    src: '/audio/sample.wav',
    keywords: [['spare'], ['jack'], ['shoulder','roadside']],
    mcq: { question: 'Where did the car stop?', options: ['Garage','Parking lot','Road shoulder','Driveway','Rest area'], answerIndex: 2 },
    script: 'A tire burst on the highway, so the driver pulled over to the road shoulder, took out the spare and the jack, and called a friend for help while starting the replacement...'
  },
  {
    id: 'ctx-9',
    title: 'Library Fine',
    src: '/audio/sample.wav',
    keywords: [['overdue','late'], ['fine','fee'], ['renew']],
    mcq: { question: 'What did the speaker request?', options: ['Refund','Renewal','Extension','Replacement','Hold'], answerIndex: 1 },
    script: 'The student returned an overdue book and asked if they could renew it to finish a chapter. The librarian checked the system, calculated a small late fee, and extended the due date...'
  },
  {
    id: 'ctx-10',
    title: 'Rainy Picnic',
    src: '/audio/sample.wav',
    keywords: [['weather','forecast'], ['umbrella'], ['shelter','gazebo']],
    mcq: { question: 'How did they continue?', options: ['Cancelled','Moved indoors','Used umbrellas','Rescheduled','Ate in car'], answerIndex: 2 },
    script: 'Despite the forecast, a sudden shower started. They grabbed umbrellas and moved to a nearby gazebo for shelter, laughing as the rain cooled the evening air...'
  },
];
