'use client';

import { useMusicPlayer } from '@/contexts/music-player-context';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Volume1,
  VolumeX,
  Music2,
} from 'lucide-react';
import Image from 'next/image';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useMemo } from 'react';

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrev,
    volume,
    setVolume,
    currentTime,
    duration,
    seek,
  } = useMusicPlayer();

  const VolumeIcon = useMemo(() => {
    if (volume === 0) return VolumeX;
    if (volume < 0.5) return Volume1;
    return Volume2;
  }, [volume]);

  if (!currentTrack) {
    return (
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-md border-t z-50">
            <div className="container mx-auto h-full flex items-center justify-between px-4">
                 <div className="flex items-center gap-4 text-muted-foreground">
                    <Music2 className="h-6 w-6"/>
                    <span>No music selected</span>
                 </div>
            </div>
        </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-md border-t z-50">
      <div className="container mx-auto h-full grid grid-cols-3 items-center px-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 rounded-md">
            <AvatarImage src={currentTrack.coverArt} alt={currentTrack.album} data-ai-hint="album cover" />
            <AvatarFallback className="rounded-md">
              <Music2 />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm truncate">{currentTrack.title}</p>
            <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={playPrev} className="h-8 w-8">
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button variant="default" size="icon" onClick={togglePlayPause} className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90">
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={playNext} className="h-8 w-8">
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          <div className="w-full flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-10 text-right">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              onValueChange={([value]) => seek(value)}
              max={duration}
              step={1}
              className="w-full"
            />
            <span className="text-xs text-muted-foreground w-10 text-left">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <VolumeIcon className="h-5 w-5" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-28 p-2" align="center" side="top">
                    <Slider
                    value={[volume]}
                    onValueChange={([value]) => setVolume(value)}
                    max={1}
                    step={0.01}
                    />
                </PopoverContent>
            </Popover>
        </div>
      </div>
    </div>
  );
}
