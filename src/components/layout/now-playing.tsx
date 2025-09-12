'use client';

import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet';
import { usePlayer } from '@/lib/context/player-context';
import Image from 'next/image';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';

export default function NowPlaying() {
  const { playerState, closeNowPlaying, togglePlay, seek, skipBack, skipForward } = usePlayer();
  const { isNowPlayingOpen, currentTrack, isPlaying, progress } = playerState;

  if (!currentTrack) return null;
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  const isValidUrl = currentTrack.albumArtUrl && typeof currentTrack.albumArtUrl === 'string' && currentTrack.albumArtUrl.startsWith('http');


  return (
    <Sheet open={isNowPlayingOpen} onOpenChange={closeNowPlaying}>
      <SheetContent
        side="bottom"
        className="h-screen w-screen max-w-full bg-gradient-to-b from-card to-background border-none p-4 sm:p-6 lg:p-8"
      >
        <div className="container mx-auto h-full flex flex-col">
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 pt-12">
            <div className="w-full max-w-sm md:max-w-md lg:max-w-lg aspect-square">
               {isValidUrl ? (
                <Image
                    src={currentTrack.albumArtUrl}
                    alt={currentTrack.title}
                    width={800}
                    height={800}
                    className="rounded-lg shadow-2xl object-cover w-full h-full"
                    data-ai-hint={currentTrack.imageHint}
                />
                 ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center rounded-lg shadow-2xl">
                    <p className="text-muted-foreground">No image available</p>
                </div>
                )}
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tighter">{currentTrack.title}</h1>
                <h2 className="text-xl lg:text-2xl text-muted-foreground mt-2">{currentTrack.artist}</h2>
                
                <div className="w-full mt-8">
                     <Slider value={[progress]} max={currentTrack.duration} step={1} className="w-full" onValueChange={(value) => seek(value[0])} />
                     <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>{formatTime(progress)}</span>
                        <span>{formatTime(currentTrack.duration)}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-4">
                     <Button variant="ghost" size="icon" className="h-14 w-14" onClick={skipBack}>
                        <SkipBack className="h-8 w-8" />
                    </Button>
                    <Button
                        variant="default"
                        size="icon"
                        className="h-20 w-20 rounded-full shadow-lg"
                        onClick={togglePlay}
                    >
                        {isPlaying ? (
                        <Pause className="h-10 w-10 fill-background" />
                        ) : (
                        <Play className="h-10 w-10 fill-background" />
                        )}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-14 w-14" onClick={skipForward}>
                        <SkipForward className="h-8 w-8" />
                    </Button>
                </div>
            </div>
          </div>
          <div className="flex-none pb-16 md:pb-4 text-center text-muted-foreground">
            Lyrics support coming soon.
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
