import { useState, useEffect, useRef } from 'react';

export type Track = {
  id: number;
  title: string;
  url: string;
};

const DUMMY_TRACKS: Track[] = [
  {
    id: 1,
    title: 'NEURAL_LINK_01 (AI GENERATED)',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'CYBER_DRIFTER_SYS (AI GENERATED)',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  },
  {
    id: 3,
    title: 'VOID_RUNTIME_ERR (AI GENERATED)',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
  },
];

export function useMusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio instance if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio(DUMMY_TRACKS[currentTrackIndex].url);
      audioRef.current.loop = false;
      audioRef.current.volume = 0.5;

      audioRef.current.addEventListener('ended', handleSkipNext);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleSkipNext);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = DUMMY_TRACKS[currentTrackIndex].url;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying((prev) => !prev);

  const handleSkipNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleSkipPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  return {
    currentTrack: DUMMY_TRACKS[currentTrackIndex],
    isPlaying,
    togglePlay,
    handleSkipNext,
    handleSkipPrev,
    tracks: DUMMY_TRACKS
  };
}
