'use client';

import { usePlayer } from '@/lib/context/player-context';
import { Slider } from '@/components/ui/slider';
import Image from 'next/image';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Music,
} from 'lucide-react';
import { Button } from '../ui/button';

export function Player() {
  const { playerState, togglePlay, openNowPlaying, seek, setVolume, skipBack, skipForward } = usePlayer();
  const { currentTrack, isPlaying, progress, volume, isMuted } = playerState;

  if (!currentTrack) {
    return null;
  }
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  const isValidUrl = currentTrack.albumArtUrl && typeof currentTrack.albumArtUrl === 'string' && currentTrack.albumArtUrl.startsWith('http');

  return (
    <footer className="fixed bottom-16 md:bottom-0 left-0 right-0 h-20 bg-card/80 backdrop-blur-xl border-t z-50">
      <div className="container mx-auto h-full px-4">
        <div className="grid grid-cols-3 items-center h-full">
          {/* Track Info */}
          <div className="flex items-center gap-3 overflow-hidden">
            <button onClick={openNowPlaying} className="flex-shrink-0">
              {isValidUrl ? (
                <Image
                  src={currentTrack.albumArtUrl}
                  alt={currentTrack.title}
                  width={56}
                  height={56}
                  className="rounded-md h-14 w-14 object-cover"
                  data-ai-hint={currentTrack.imageHint}
                />
              ) : (
                <div className="h-14 w-14 flex-shrink-0 rounded-md bg-muted flex items-center justify-center">
                  <Music className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </button>
            <div className="overflow-hidden">
              <p className="font-semibold truncate cursor-pointer hover:underline" onClick={openNowPlaying}>{currentTrack.title}</p>
              <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-10 w-10" onClick={skipBack}>
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                variant="default"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 fill-background" />
                ) : (
                  <Play className="h-6 w-6 fill-background" />
                )}
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10" onClick={skipForward}>
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            <div className="w-full max-w-xs flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{formatTime(progress)}</span>
                <Slider value={[progress]} max={currentTrack.duration} step={1} className="w-full" onValueChange={(value) => seek(value[0])} />
                <span className="text-xs text-muted-foreground">{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Volume and Other Controls */}
          <div className="flex items-center justify-end gap-3">
            {isMuted ? <VolumeX className="h-5 w-5 text-muted-foreground" /> : <Volume2 className="h-5 w-5 text-muted-foreground" />}
            <Slider value={[volume]} max={1} step={0.05} className="w-24" onValueChange={(value) => setVolume(value[0])} />
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={openNowPlaying}>
                <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
