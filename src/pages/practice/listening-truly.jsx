import React, { useRef, useState } from 'react';
import Card from '../../components/Card';

const TOPICS = [
  {
    key: 'travel',
    title: 'Travel Adventure',
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop',
    items: [
      { src: '/audio/sample.wav', title: 'Lost Luggage' },
      { src: '/audio/sample.wav', title: 'Desert Trek' },
    ],
  },
  {
    key: 'famous',
    title: 'Famous Individuals',
    cover: 'https://www.pioneeringminds.com/wp-content/uploads/2018/10/Steve-Jobs.jpg?w=1200&q=80&auto=format&fit=crop',
    items: [
      { src: '/audio/sample.wav', title: 'Perfectionism (Steve Jobs)' },
      { src: '/audio/sample.wav', title: 'From 0 to 1 (Azim Pulat)' },
    ],
  },
  {
    key: 'culture',
    title: 'Culture Day Abroad',
    cover: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80&auto=format&fit=crop',
    items: [
      { src: '/audio/sample.wav', title: 'Street Parade' },
      { src: '/audio/sample.wav', title: 'Tea Rituals' },
    ],
  },
  {
    key: 'personal',
    title: 'Personal Story',
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80&auto=format&fit=crop',
    items: [
      { src: '/audio/sample.wav', title: 'First Job' },
      { src: '/audio/sample.wav', title: 'Night Train' },
    ],
  },
  {
    key: 'wildlife',
    title: 'Wildlife & Nature',
    cover: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80&auto=format&fit=crop',
    items: [
      { src: '/audio/sample.wav', title: 'Forest Dawn' },
      { src: '/audio/sample.wav', title: 'River Echoes' },
    ],
  },
];

export default function ListeningTruly() {
  const audioRef = useRef(null);
  const [current, setCurrent] = useState({ src: '', title: '' });

  const play = (track) => {
    setCurrent(track);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.playbackRate = 1;
        audioRef.current.play().catch(() => {});
      }
    }, 0);
  };

  const onCoverError = (e) => {
    e.currentTarget.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
  };

  return (
    <div className="space-y-4">
      <Card title="Listening — Truly">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Pick a topic and then a clip. No timer, just natural listening.
        </p>
      </Card>

      {TOPICS.map((topic) => (
        <Card key={topic.key} title={topic.title}>
          <div className="grid md:grid-cols-[260px_1fr] gap-3 items-start">
            <img
              src={topic.cover}
              alt="cover"
              onError={onCoverError}
              className="w-full h-44 md:h-48 object-cover rounded-xl border border-gray-200 dark:border-white/10"
              loading="lazy"
            />
            <div className="grid sm:grid-cols-2 gap-2">
              {topic.items.map((it, idx) => (
                <button
                  key={`${topic.key}-${idx}-${it.title}`}
                  onClick={() => play(it)}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-left hover:bg-black/5 dark:hover:bg-white/10"
                >
                  {it.title}
                </button>
              ))}
            </div>
          </div>
        </Card>
      ))}

      <Card title={current.title || 'Player'}>
        <audio
          ref={audioRef}
          src={current.src}
          controls
          onLoadedMetadata={() => {
            if (audioRef.current) audioRef.current.playbackRate = 1;
          }}
          className="w-full"
        />
      </Card>
    </div>
  );
}