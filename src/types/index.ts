export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  url: string;
  coverArt: string;
};

export type Playlist = {
  id: string;
  name: string;
  description: string;
  songs: Song[];
  coverArt: string;
};
