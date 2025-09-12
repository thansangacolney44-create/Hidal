'use client';

import { MediaCard } from '@/components/media/media-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getMedia } from '@/lib/firebase/media';
import { Loader2, Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import type { Media } from '@/types';
import { searchMedia } from './actions';
import { useToast } from '@/hooks/use-toast';

export default function SearchPage() {
  const [allMedia, setAllMedia] = useState<Media[]>([]);
  const [searchResults, setSearchResults] = useState<Media[]>([]);
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function loadMedia() {
      const media = await getMedia();
      setAllMedia(media);
      setSearchResults(media); // Initially show all media
    }
    loadMedia();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      if (!query) {
        setSearchResults(allMedia);
        return;
      }
      const results = await searchMedia(query, allMedia);
      setSearchResults(results);
    });
  };
  
  const handleFiltersClick = () => {
    toast({
        title: 'Coming Soon!',
        description: 'Advanced search filters are on the way.',
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Search</h1>
        <p className="text-muted-foreground mt-2">
          Find your next favorite track, video, or artist.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex w-full max-w-lg items-center space-x-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="e.g., i love you, or just ily..."
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
        </Button>
         <Button variant="outline" className="hidden sm:flex" onClick={handleFiltersClick}>
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
        </Button>
      </form>

      <div>
        {isPending ? (
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({length: 12}).map((_, i) => (
                <div key={i} className="aspect-square w-full bg-muted rounded-lg animate-pulse" />
              ))}
           </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {searchResults.map((item) => (
              <MediaCard key={item.id} media={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No results found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
