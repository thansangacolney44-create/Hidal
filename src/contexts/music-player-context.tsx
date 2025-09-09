"use client";

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import type { Song, Playlist } from '@/types';

interface MusicPlayerContextType {
  playlist: Playlist | null;
  currentTrack: Song | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  loadPlaylist: (playlist: Playlist, trackIndex?: number) => void;
  play: () => void;
  pause: () => void;
  playNext: () => void;
  playPrev: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  togglePlayPause: () => void;
}

export const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = playlist?.songs[currentTrackIndex] || null;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio();
      audioRef.current = audio;

      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleDurationChange = () => setDuration(audio.duration);
      const handleEnded = () => playNext();

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('durationchange', handleDurationChange);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('durationchange', handleDurationChange);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (audioRef.current.src !== currentTrack.url) {
        audioRef.current.src = currentTrack.url;
        audioRef.current.load();
      }
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrack, isPlaying]);
  
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = volume;
    }
  }, [volume]);


  const loadPlaylist = useCallback((newPlaylist: Playlist, trackIndex: number = 0) => {
    setPlaylist(newPlaylist);
    setCurrentTrackIndex(trackIndex);
    setIsPlaying(true);
  }, []);
  
  const play = useCallback(() => {
    if (audioRef.current && audioRef.current.src) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
        setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    if(audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const playNext = useCallback(() => {
    if (!playlist) return;
    const nextIndex = (currentTrackIndex + 1) % playlist.songs.length;
    setCurrentTrackIndex(nextIndex);
  }, [playlist, currentTrackIndex]);

  const playPrev = useCallback(() => {
    if (!playlist) return;
    const prevIndex = (currentTrackIndex - 1 + playlist.songs.length) % playlist.songs.length;
    setCurrentTrackIndex(prevIndex);
  }, [playlist, currentTrackIndex]);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
  }, []);
  
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const value = {
    playlist,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    volume,
    currentTime,
    duration,
    loadPlaylist,
    play,
    pause,
    playNext,
    playPrev,
    setVolume,
    seek,
    togglePlayPause,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
