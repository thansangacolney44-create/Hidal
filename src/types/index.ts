export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  url: string;
  coverArt: string;
  createdAt?: any; // To store Firestore timestamp
};

export type Playlist = {
  id: string;
  name: string;
  description: string;
  songs: Song[];
  coverArt: string;
};
