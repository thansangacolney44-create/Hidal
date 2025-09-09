import type { Song, Playlist } from '@/types';

export const allSongs: Song[] = [
  {
    id: '1',
    title: 'Cosmic Drift',
    artist: 'Astro Beats',
    album: 'Galaxy Grooves',
    duration: 185,
    url: 'https://cdn.pixabay.com/audio/2023/08/03/audio_eb7f999672.mp3',
    coverArt: 'https://picsum.photos/seed/cosmos/500/500',
  },
  {
    id: '2',
    title: 'Oceanic Pulse',
    artist: 'Deep Wave',
    album: 'Tidal Rhythms',
    duration: 210,
    url: 'https://cdn.pixabay.com/audio/2024/05/29/audio_78b8717d23.mp3',
    coverArt: 'https://picsum.photos/seed/ocean/500/500',
  },
  {
    id: '3',
    title: 'City Lights',
    artist: 'Urban Flow',
    album: 'Metropolis',
    duration: 195,
    url: 'https://cdn.pixabay.com/audio/2024/04/18/audio_27b8cb7970.mp3',
    coverArt: 'https://picsum.photos/seed/city/500/500',
  },
  {
    id: '4',
    title: 'Forest Lullaby',
    artist: 'Nature\'s Echo',
    album: 'Whispering Woods',
    duration: 240,
    url: 'https://cdn.pixabay.com/audio/2022/11/17/audio_87a2a0e261.mp3',
    coverArt: 'https://picsum.photos/seed/forest/500/500',
  },
  {
    id: '5',
    title: 'Desert Mirage',
    artist: 'Sandstorm',
    album: 'Dunes of Time',
    duration: 220,
    url: 'https://cdn.pixabay.com/audio/2024/05/10/audio_51ed592f02.mp3',
    coverArt: 'https://picsum.photos/seed/desert/500/500',
  },
  {
    id: '6',
    title: 'Glacier Step',
    artist: 'Ice Core',
    album: 'Arctic Chill',
    duration: 170,
    url: 'https://cdn.pixabay.com/audio/2023/12/18/audio_1ba5d6ce67.mp3',
    coverArt: 'https://picsum.photos/seed/glacier/500/500',
  },
  {
    id: '7',
    title: 'Sunrise Overdrive',
    artist: 'Dawn Riders',
    album: 'First Light',
    duration: 200,
    url: 'https://cdn.pixabay.com/audio/2024/02/09/audio_3d191e4a10.mp3',
    coverArt: 'https://picsum.photos/seed/sunrise/500/500',
  },
  {
    id: '8',
    title: 'Midnight Motion',
    artist: 'Night Crawlers',
    album: 'After Dark',
    duration: 230,
    url: 'https://cdn.pixabay.com/audio/2023/06/20/audio_7aa7f1d432.mp3',
    coverArt: 'https://picsum.photos/seed/midnight/500/500',
  },
];

export const allPlaylists: Playlist[] = [
  {
    id: 'p1',
    name: 'Chillwave Commute',
    description: 'Relaxing tunes for your drive.',
    songs: allSongs.slice(0, 4),
    coverArt: 'https://picsum.photos/seed/chill/500/500',
  },
  {
    id: 'p2',
    name: 'Focus Flow',
    description: 'Instrumental tracks to boost productivity.',
    songs: allSongs.slice(4, 8),
    coverArt: 'https://picsum.photos/seed/focus/500/500',
  },
  {
    id: 'p3',
    name: 'Late Night Vibes',
    description: 'Smooth beats for after hours.',
    songs: [allSongs[1], allSongs[3], allSongs[5], allSongs[7]],
    coverArt: 'https://picsum.photos/seed/latenight/500/500',
  },
  {
    id: 'p4',
    name: 'Workout Beats',
    description: 'High-energy tracks to get you moving.',
    songs: [allSongs[0], allSongs[2], allSongs[4], allSongs[6]],
    coverArt: 'https://picsum.photos/seed/workout/500/500',
  },
  {
    id: 'p5',
    name: 'HidalWave Essentials',
    description: 'The very best of our collection.',
    songs: allSongs,
    coverArt: 'https://picsum.photos/seed/essentials/500/500'
  },
  {
    id: 'p6',
    name: 'Ambient Dreams',
    description: 'Soundscapes for sleeping and meditation.',
    songs: [allSongs[1], allSongs[3]],
    coverArt: 'https://picsum.photos/seed/ambient/500/500'
  }
];

export function getPlaylistById(id: string): Playlist | undefined {
  return allPlaylists.find((p) => p.id === id);
}

// In a real app, these would be hooks fetching data from an API
export const usePlaylists = () => allPlaylists;
export const useSongs = () => allSongs;
