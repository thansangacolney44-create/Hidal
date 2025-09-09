
'use client'

import { AppLayout } from '@/components/layout/app-layout';
import { allPlaylists, allSongs } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { MusicPlayerContext, useMusicPlayer } from '@/contexts/music-player-context';
import { useContext } from 'react';
import { PlayButton } from '@/components/music/play-button';

const PlaylistCard = ({ playlist }: { playlist: (typeof allPlaylists)[0] }) => {
  return (
    <Link href={`/playlists/${playlist.id}`} className="block group">
      <Card className="overflow-hidden transition-all duration-300 hover:bg-card/60 hover:shadow-lg">
        <CardContent className="p-0">
          <div className="relative aspect-square">
            <Image
              src={playlist.coverArt}
              alt={playlist.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="album cover"
            />
             <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayButton playlist={playlist} size="lg" />
             </div>
          </div>
          <div className="p-3">
            <h3 className="font-semibold truncate">{playlist.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{playlist.description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};


const SongCard = ({ song }: { song: (typeof allSongs)[0] }) => {
  const songAsPlaylist = { id: song.id, name: song.album, description: `Single by ${song.artist}`, songs: [song], coverArt: song.coverArt };
  return (
    <div className="group relative">
      <Card className="overflow-hidden transition-all duration-300 hover:bg-card/60 hover:shadow-lg">
        <CardContent className="p-0">
          <div className="relative aspect-square">
            <Image
              src={song.coverArt}
              alt={song.album}
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


export default function Home() {
  return (
    <AppLayout>
      <div className="p-4 sm:p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">Welcome to HidalWave</h1>
          <p className="text-muted-foreground max-w-2xl">
            Your personal high-fidelity music sanctuary. Upload your tracks, create playlists, and immerse yourself in pure sound.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Featured Playlists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {allPlaylists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Recently Added</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {allSongs.slice(0, 6).map((song) => (
               <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
