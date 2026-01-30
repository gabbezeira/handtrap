import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Import music files
import msc00 from '../assets/musics/msc00.mp3';
import msc01 from '../assets/musics/msc01.mp3';
import msc02 from '../assets/musics/msc02.mp3';
import msc03 from '../assets/musics/msc03.mp3';

const MUSIC_FILES = [msc00, msc01, msc02, msc03];

interface MusicContextType {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTrack: number;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  togglePlay: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.3); // 30% default volume
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [audio] = useState(() => new Audio());
  const [hasInteracted, setHasInteracted] = useState(false);
  const [playlist, setPlaylist] = useState<number[]>([]);

  const shuffleArray = (array: number[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const indices = MUSIC_FILES.map((_, i) => i);
    setPlaylist(shuffleArray(indices));
  }, []);

  useEffect(() => {
    const handleFirstClick = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        setIsPlaying(true);
      }
    };

    document.addEventListener('click', handleFirstClick, { once: true });
    return () => document.removeEventListener('click', handleFirstClick);
  }, [hasInteracted]);

  useEffect(() => {
    audio.volume = isMuted ? 0 : volume;
  }, [audio, volume, isMuted]);

  useEffect(() => {
    if (isPlaying && playlist.length > 0) {
      const trackIndex = playlist[currentTrack % playlist.length];
      audio.src = MUSIC_FILES[trackIndex];
      audio.play().catch(err => console.warn('Audio play failed:', err));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack, audio, playlist]);

  useEffect(() => {
    const handleEnded = () => {
      setCurrentTrack(prev => prev + 1);
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [audio]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        volume,
        isMuted,
        currentTrack,
        setVolume,
        toggleMute,
        togglePlay
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider');
  }
  return context;
};
