
"use client";

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import type { Song, Playlist } from '@/types';
import { getDropboxTemporaryLink } from '@/lib/data-service';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = playlist?.songs[currentTrackIndex] || null;

  const playNext = useCallback(() => {
    if (!playlist) return;
    const nextIndex = (currentTrackIndex + 1) % playlist.songs.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  }, [playlist, currentTrackIndex]);

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
      audio.addEventListener('error', (e) => {
        console.error("Audio playback error", e);
        toast({
            title: "Playback Error",
            description: "Could not play the selected track.",
            variant: "destructive"
        })
        setIsPlaying(false);
      })

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('durationchange', handleDurationChange);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [playNext, toast]);

  useEffect(() => {
    const playTrack = async () => {
        if (audioRef.current && currentTrack) {
            try {
                // The `url` field now stores the Dropbox file path
                const temporaryLink = await getDropboxTemporaryLink(currentTrack.url);
                if (audioRef.current.src !== temporaryLink) {
                    audioRef.current.src = temporaryLink;
                    audioRef.current.load();
                }
                if (isPlaying) {
                    await audioRef.current.play();
                } else {
                    audioRef.current.pause();
                }
            } catch (error) {
                console.error("Failed to get temporary link and play:", error);
                toast({
                    title: "Playback Error",
                    description: "Failed to load track from Dropbox.",
                    variant: "destructive"
                });
                setIsPlaying(false);
            }
        } else if (!currentTrack) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
            setIsPlaying(false);
        }
    };
    playTrack();
  }, [currentTrack, isPlaying, toast]);
  
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
    } else if (playlist && playlist.songs.length > 0 && currentTrackIndex === -1) {
        // If nothing is loaded, play the first song of the playlist
        setCurrentTrackIndex(0);
        setIsPlaying(true);
    }
  }, [playlist, currentTrackIndex]);

  const pause = useCallback(() => {
    if(audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (currentTrack) {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    } else if (playlist && playlist.songs.length > 0) {
        // No track is active, so start the playlist
        loadPlaylist(playlist, 0);
    }
  }, [isPlaying, pause, play, currentTrack, playlist, loadPlaylist]);

  const playPrev = useCallback(() => {
    if (!playlist) return;
    const prevIndex = (currentTrackIndex - 1 + playlist.songs.length) % playlist.songs.length;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  }, [playlist, currentTrackIndex]);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
  }, []);
  
  const seek = useCallback((time: number) => {
    if (audioRef.current && isFinite(time)) {
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
