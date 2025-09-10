
'use client';
import { getAllSongs } from '@/lib/data-service';
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
import { Music2, Clock, Search, Download, Loader2, AlertCircle } from 'lucide-react';
import { PlayButton } from '@/components/music/play-button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const formatDuration = (seconds: number) => {
  if (isNaN(seconds) || seconds === 0) return '-:--';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
      async function fetchSongs() {
          try {
              setIsLoading(true);
              setError(null);
              const allSongs = await getAllSongs();
              setSongs(allSongs);
          } catch (err) {
              console.error("Failed to fetch library:", err);
              if (err instanceof Error) {
                setError(err.message);
              }
          } finally {
              setIsLoading(false);
          }
      }
      fetchSongs();
  }, []);

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
    // This uses a proxy to bypass CORS issues with direct download from Firebase Storage.
    // In a real production app, you might want to set up proper CORS rules on your bucket.
    fetch(song.url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const filename = song.url.substring(song.url.lastIndexOf('/') + 1).split('?')[0].split('%2F').pop() || `${song.title}.mp3`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(e => console.error("Download failed", e));
  }

  if (error) {
    return (
        <div className="p-8">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error connecting to Database</AlertTitle>
                <AlertDescription>
                    There was an issue fetching your music library. Please ensure your Supabase URL and key are correct in your `.env` file and that you have created the `songs` table in your database.
                </AlertDescription>
            </Alert>
        </div>
    )
  }


  return (
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

        {isLoading ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        ) : filteredSongs.length > 0 ? (
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
        ) : (
             <div className="text-center py-16 rounded-lg border-2 border-dashed bg-muted/50">
                <h2 className="text-2xl font-semibold">No Songs Found</h2>
                <p className="text-muted-foreground mt-2">
                    {songs.length > 0 ? "Try a different search term." : "Your library is empty. Upload your first track!"}
                </p>
                {songs.length === 0 && (
                    <Button asChild className="mt-4">
                        <Link href="/upload">Upload Music</Link>
                    </Button>
                )}
            </div>
        )}
      </div>
  );
}
