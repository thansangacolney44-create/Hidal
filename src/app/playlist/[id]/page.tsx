'use client';

import { useParams } from 'next/navigation';
import { getPlaylistById } from '@/lib/mock-data';
import { AppLayout } from '@/components/layout/app-layout';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Music2, Clock, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import { useMusicPlayer } from '@/contexts/music-player-context';
import { PlayButton } from '@/components/music/play-button';

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function PlaylistPage() {
  const params = useParams();
  const id = params.id as string;
  const playlist = getPlaylistById(id);
  const { loadPlaylist } = useMusicPlayer();

  if (!playlist) {
    notFound();
  }

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row items-start gap-8 p-4 sm:p-6 md:p-8">
        <div className="w-full md:w-1/3 lg:w-1/4 xl:w-1/5 flex-shrink-0">
          <div className="aspect-square relative rounded-lg overflow-hidden shadow-2xl">
            <Image
              src={playlist.coverArt}
              alt={playlist.name}
              fill
              className="object-cover"
              data-ai-hint="album cover"
            />
          </div>
          <div className="mt-4 space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter">{playlist.name}</h1>
            <p className="text-muted-foreground">{playlist.description}</p>
            <p className="text-sm text-muted-foreground">{playlist.songs.length} songs</p>
            <Button onClick={() => loadPlaylist(playlist)} className="w-full bg-primary hover:bg-primary/90">
              <Play className="mr-2 h-4 w-4" /> Play All
            </Button>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Artist</TableHead>
                <TableHead className="text-right">
                  <Clock className="inline-block h-4 w-4" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playlist.songs.map((song, index) => (
                <TableRow key={song.id} className="group">
                  <TableCell className="text-muted-foreground">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <span className="group-hover:hidden">{index + 1}</span>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <PlayButton playlist={playlist} trackIndex={index} size="sm" variant="ghost" />
                        </div>
                    </div>
                  </TableCell>
                  <TableCell className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 rounded-md hidden sm:block">
                      <AvatarImage src={song.coverArt} alt={song.album} data-ai-hint="album art" />
                      <AvatarFallback className="rounded-md bg-secondary">
                        <Music2 className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{song.title}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{song.artist}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatDuration(song.duration)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
