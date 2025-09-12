'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { Media, Playlist } from '@/types';
import { getMedia } from '@/lib/firebase/media';
import { Button } from '@/components/ui/button';
import { Clock, Music, Play } from 'lucide-react';
import Image from 'next/image';
import { usePlayer } from '@/lib/context/player-context';

export default function PlaylistPage({ params }: { params: { id: string } }) {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const { play } = usePlayer();

  useEffect(() => {
    async function fetchPlaylist() {
      if (!params.id) return;
      setLoading(true);

      try {
        const playlistRef = doc(db, 'playlists', params.id);
        const playlistSnap = await getDoc(playlistRef);

        if (playlistSnap.exists()) {
          const playlistData = { id: playlistSnap.id, ...playlistSnap.data() } as Playlist;
          setPlaylist(playlistData);
          
          if(playlistData.mediaIds && playlistData.mediaIds.length > 0) {
            const allMedia = await getMedia();
            const items = allMedia.filter(item => playlistData.mediaIds.includes(item.id));
            setMediaItems(items);
          }

        } else {
          console.log('No such playlist!');
        }
      } catch (error) {
        console.error("Error fetching playlist:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlaylist();
  }, [params.id]);

  const handlePlay = (item: Media) => {
    play(item);
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
  
  if (loading) {
    return <div>Loading playlist...</div>;
  }

  if (!playlist) {
    return <div>Playlist not found.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
        <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
            <Image
                src={playlist.albumArtUrl}
                alt={playlist.title}
                width={256}
                height={256}
                className="rounded-lg shadow-2xl object-cover w-full h-full"
                data-ai-hint={playlist.imageHint}
            />
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Playlist</h2>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mt-2">{playlist.title}</h1>
            <p className="text-muted-foreground mt-4">{playlist.description}</p>
            <p className="text-sm text-muted-foreground mt-2">{mediaItems.length} songs</p>
        </div>
      </div>
      
      <div className="space-y-2">
         {mediaItems.map((item, index) => (
             <div key={item.id} className="group grid grid-cols-[auto,1fr,auto] items-center gap-4 p-2 rounded-md hover:bg-accent/50 cursor-pointer" onClick={() => handlePlay(item)}>
                <div className="text-center text-muted-foreground w-8">{index + 1}</div>
                <div className="flex items-center gap-4">
                    {item.albumArtUrl && <Image src={item.albumArtUrl} alt={item.title} width={40} height={40} className="w-10 h-10 rounded-md object-cover" />}
                    <div>
                        <p className="font-semibold text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.artist}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{formatTime(item.duration)}</span>
                     <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); handlePlay(item); }}>
                        <Play className="h-4 w-4" />
                    </Button>
                </div>
             </div>
         ))}
      </div>
       {mediaItems.length === 0 && !loading && (
        <div className="text-center py-12">
            <Music className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">This playlist is empty</h3>
            <p className="mt-1 text-sm text-muted-foreground">Add some songs to get started.</p>
        </div>
       )}
    </div>
  );
}
