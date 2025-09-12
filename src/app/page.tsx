import { MediaCard } from '@/components/media/media-card';
import { getMedia, getPlaylists } from '@/lib/firebase/media';
import Link from 'next/link';

export default async function Home() {
  const media = await getMedia();
  const playlists = await getPlaylists();

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-bold tracking-tight mb-6">Recently Added</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {media.slice(0, 6).map((item) => (
            <MediaCard key={item.id} media={item} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold tracking-tight mb-6">Featured Playlists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.map((playlist) => (
            <Link href={`/playlist/${playlist.id}`} key={playlist.id} className="group relative">
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-card group-hover:opacity-80 transition-opacity">
                <img
                  src={playlist.albumArtUrl}
                  alt={playlist.title}
                  className="h-full w-full object-cover"
                  data-ai-hint={playlist.imageHint}
                />
              </div>
              <div className="mt-2">
                <h3 className="font-semibold text-foreground truncate">{playlist.title}</h3>
                <p className="text-sm text-muted-foreground">{playlist.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
       <section>
        <h2 className="text-3xl font-bold tracking-tight mb-6">All Content</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {media.map((item) => (
            <MediaCard key={item.id} media={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
