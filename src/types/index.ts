
export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  url: string; // This will be a data URL for simplicity
  coverArt: string; // This will be a data URL
  created_at: string;
};

export type Playlist = {
  id: string;
  name: string;
  description: string;
  songs: Song[];
  coverArt: string;
};
