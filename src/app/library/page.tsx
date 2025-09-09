'use client';
import { AppLayout } from '@/components/layout/app-layout';
import { allSongs } from '@/lib/mock-data';
import { Song } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Music2, Clock, Search, Download } from 'lucide-react';
import { PlayButton } from '@/components/music/play-button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const formatDuration = (seconds: number) => {
  if (isNaN(seconds) || seconds === 0) return '-:--';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [songs, setSongs] = useState(allSongs);

  const libraryPlaylist = {
    id: 'library',
    name: 'My Library',
    description: 'All my songs',
    songs: songs,
    coverArt: '',
  };

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.album.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDownload = (song: Song) => {
    const link = document.createElement('a');
    link.href = song.url;
    // Extract filename from URL or use song title
    const filename = song.url.substring(song.url.lastIndexOf('/') + 1) || `${song.title}.mp3`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  return (
    <AppLayout>
      <div className="p-4 sm:p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tighter">Music Library</h1>
          <p className="text-muted-foreground">All your uploaded tracks in one place.</p>
        </div>

        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for a song, artist, or album..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Artist</TableHead>
              <TableHead className="hidden lg:table-cell">Album</TableHead>
              <TableHead className="text-right">
                <Clock className="inline-block h-4 w-4" />
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSongs.map((song, index) => (
              <TableRow key={song.id} className="group">
                <TableCell>
                  <div className="relative">
                    <Avatar className="h-10 w-10 rounded-md">
                      <AvatarImage src={song.coverArt} alt={song.album} data-ai-hint="album art" />
                      <AvatarFallback className="rounded-md bg-secondary">
                        <Music2 className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                      <PlayButton playlist={{...libraryPlaylist, songs: filteredSongs}} trackIndex={index} size="sm" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{song.title}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{song.artist}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">{song.album}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatDuration(song.duration)}
                </TableCell>
                <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(song)} className="opacity-0 group-hover:opacity-100">
                        <Download className="h-5 w-5" />
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
