import { db, storage } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Song } from '@/types';

// Create a new type for song data to be stored in Firestore, omitting the id
export type SongData = Omit<Song, 'id'>;

/**
 * Adds a new song to the Firestore database and uploads the associated files.
 * @param songData - The song metadata (title, artist, album).
 * @param audioFile - The audio file to be uploaded.
 * @param coverArtFile - The cover art image file to be uploaded.
 * @returns The newly created song object with its ID.
 */
export async function addSong(
  songData: Omit<SongData, 'url' | 'coverArt' | 'duration'>,
  audioFile: File,
  coverArtFile: File
): Promise<Song> {
  try {
    // 1. Upload files to Firebase Storage
    const audioFileName = `audio/${Date.now()}_${audioFile.name}`;
    const coverArtFileName = `coverArt/${Date.now()}_${coverArtFile.name}`;

    const audioRef = ref(storage, audioFileName);
    const coverArtRef = ref(storage, coverArtFileName);

    const [audioUpload, coverArtUpload] = await Promise.all([
      uploadBytes(audioRef, audioFile),
      uploadBytes(coverArtRef, coverArtFile),
    ]);

    // 2. Get download URLs for the uploaded files
    const [url, coverArt] = await Promise.all([
      getDownloadURL(audioUpload.ref),
      getDownloadURL(coverArtUpload.ref),
    ]);

    // 3. Get audio duration
    const duration = await getAudioDuration(audioFile);

    // 4. Add song metadata to Firestore
    const newSongData: SongData = {
      ...songData,
      url,
      coverArt,
      duration,
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'songs'), newSongData);

    return {
      id: docRef.id,
      ...newSongData,
    };
  } catch (error) {
    console.error("Error adding song: ", error);
    throw new Error("Failed to add new song.");
  }
}

/**
 * Fetches all songs from the Firestore database, ordered by creation date.
 * @returns A promise that resolves to an array of songs.
 */
export async function getAllSongs(): Promise<Song[]> {
  try {
    const songsQuery = query(collection(db, 'songs'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(songsQuery);
    const songs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Song));
    return songs;
  } catch (error) {
    console.error("Error fetching songs: ", error);
    throw new Error("Failed to fetch songs.");
  }
}

/**
 * Fetches recently added songs from Firestore.
 * @param count - The number of recent songs to fetch.
 * @returns A promise that resolves to an array of songs.
 */
export async function getRecentSongs(count: number = 6): Promise<Song[]> {
    try {
        const songsQuery = query(collection(db, 'songs'), orderBy('createdAt', 'desc'), limit(count));
        const querySnapshot = await getDocs(songsQuery);
        const songs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        } as Song));
        return songs;
    } catch (error) {
        console.error("Error fetching recent songs: ", error);
        throw new Error("Failed to fetch recent songs.");
    }
}


// Helper to get audio duration
function getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
        const audio = document.createElement('audio');
        audio.preload = 'metadata';
        audio.onloadedmetadata = () => {
            window.URL.revokeObjectURL(audio.src);
            resolve(Math.round(audio.duration));
        };
        audio.src = URL.createObjectURL(file);
    });
}
