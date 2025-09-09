
'use client'

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { PlayButton } from '@/components/music/play-button';
import { getRecentSongs } from '@/lib/data-service';
import { useEffect, useState } from 'react';
import type { Song } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const SongCard = ({ song }: { song: Song }) => {
  const songAsPlaylist = { id: song.id, name: song.album, description: `Single by ${song.artist}`, songs: [song], coverArt: song.coverArt };
  return (
    <div className="group relative">
      <Card className="overflow-hidden transition-all duration-300 hover:bg-card/60 hover:shadow-lg">
        <CardContent className="p-0">
          <div className="relative aspect-square">
            <Image
              src={song.coverArt}
              alt={song.album || 'Album cover'}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="album art"
            />
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayButton playlist={songAsPlaylist} size="lg" />
             </div>
          </div>
          <div className="p-3">
            <h3 className="font-semibold truncate">{song.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const WelcomeSection = () => (
    <div className="space-y-2">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">Welcome to HidalWave</h1>
      <p className="text-muted-foreground max-w-2xl">
        Your personal high-fidelity music sanctuary. Upload your tracks and immerse yourself in pure sound.
      </p>
    </div>
)

const EmptyLibrary = () => (
    <div className="text-center py-16 rounded-lg border-2 border-dashed bg-muted/50">
        <h2 className="text-2xl font-semibold">Your Library is Empty</h2>
        <p className="text-muted-foreground mt-2">Upload your first track to get started!</p>
    </div>
)


export default function Home() {
    const [recentSongs, setRecentSongs] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchSongs() {
            try {
                const songs = await getRecentSongs();
                setRecentSongs(songs);
            } catch (error) {
                console.error("Failed to load recent songs:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSongs();
    }, []);

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 md:p-8 space-y-8">
        <WelcomeSection />
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Recently Added</h2>
          {isLoading ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {Array.from({length: 6}).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="aspect-square rounded-lg" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
             </div>
          ) : recentSongs.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {recentSongs.map((song) => (
                   <SongCard key={song.id} song={song} />
                ))}
            </div>
          ) : (
            <EmptyLibrary />
          )}
        </section>
      </div>
    </AppLayout>
  );
}
