
'use client';
import { getAllSongs, getDropboxTemporaryLink, deleteSong } from '@/lib/data-service';
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
import { Music2, Clock, Search, Download, Loader2, AlertCircle, Trash2, MoreVertical } from 'lucide-react';
import { PlayButton } from '@/components/music/play-button';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);
  const [isDeletePending, startDeleteTransition] = useTransition();
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSongs = async () => {
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

  useEffect(() => {
    fetchSongs();
  }, []);

  const libraryPlaylist = {
    id: 'library-all',
    name: 'All Music',
    description: 'All songs on the platform',
    songs: songs,
    coverArt: '',
  };

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (song.artist && song.artist.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (song.album && song.album.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleDownload = async (song: Song) => {
    toast({ title: 'Preparing Download', description: 'Generating a secure link...' });
    try {
      const linkUrl = await getDropboxTemporaryLink(song.url);
      const link = document.createElement('a');
      link.href = linkUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Download failed", e);
      toast({ title: 'Download Failed', description: 'Could not generate a download link.', variant: 'destructive' });
    }
  }

  const handleDelete = (song: Song) => {
    setSongToDelete(song);
  }

  const confirmDelete = () => {
    if (!songToDelete) return;
    
    startDeleteTransition(async () => {
        try {
            await deleteSong(songToDelete.id);
            toast({
                title: 'Song Deleted',
                description: `"${songToDelete.title}" has been removed.`,
            });
            await fetchSongs(); // Re-fetch songs after deletion
        } catch (error) {
            toast({
                title: 'Deletion Failed',
                description: 'Could not delete the song.',
                variant: 'destructive',
            });
        } finally {
            setSongToDelete(null);
        }
    })
  }

  if (error) {
    return (
        <div className="p-8">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Music</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
        </div>
    )
  }

  return (
      <>
        <AlertDialog open={!!songToDelete} onOpenChange={() => setSongToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this song?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete <span className="font-bold">"{songToDelete?.title}"</span>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete} disabled={isDeletePending}>
                        {isDeletePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <div className="p-4 sm:p-6 md:p-8">
            <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tighter">All Music</h1>
            <p className="text-muted-foreground">Discover all tracks uploaded by the community.</p>
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
                           {user && song.userId === user.uid && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                        <MoreVertical className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleDownload(song)}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Download
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDelete(song)} className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                           )}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            ) : (
                <div className="text-center py-16 rounded-lg border-2 border-dashed bg-muted/50">
                    <h2 className="text-2xl font-semibold">No Songs Found</h2>
                    <p className="text-muted-foreground mt-2">
                        {songs.length > 0 ? "Try a different search term." : "Be the first to upload a song!"}
                    </p>
                    {songs.length === 0 && (
                        <Button asChild className="mt-4">
                            <Link href="/upload">Upload Music</Link>
                        </Button>
                    )}
                </div>
            )}
        </div>
      </>
  );
}
