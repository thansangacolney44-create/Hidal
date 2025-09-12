
'use server';

import type { Song } from '@/types';
import { getFirebaseAdmin } from './firebase-admin';

const getDb = async () => {
    const { db } = await getFirebaseAdmin();
    return db;
}

/**
 * Adds a new song to the Firestore database.
 * @param songData - The song metadata (title, artist, album, userId).
 * @param fileId - The ID of the file in Dropbox.
 * @param fileName - The name of the file.
 * @param fileSize - The size of the file in bytes.
 * @returns The newly created song object.
 */
export async function addSong(
  songData: Omit<Song, 'id' | 'url' | 'coverArt' | 'duration' | 'created_at' | 'size'>,
  fileId: string, // This is the Dropbox file ID
  fileName: string,
  fileSize: number
): Promise<Song> {
    const db = await getDb();
    
    // In a real app, you might use a Dropbox temporary link or a server proxy.
    const url = `https://content.dropboxapi.com/2/files/download`; // This needs auth to work

    const coverArt = `https://picsum.photos/seed/${fileId}/500/500`;

    const duration = 0; // Placeholder

    const newSong: Omit<Song, 'id'> = {
        ...songData,
        url: fileId, // Store the fileId to use for downloading
        coverArt,
        duration,
        size: fileSize,
        created_at: new Date().toISOString(),
    };

    try {
        const docRef = await db.collection('songs').add(newSong);
        const doc = await docRef.get();
        return { id: doc.id, ...doc.data() } as Song;
    } catch (error) {
        console.error('Error adding song to Firestore:', error);
        throw new Error('Failed to add song to the database.');
    }
}


/**
 * Fetches all songs from Firestore, ordered by creation date.
 * This is now a public feed.
 * @returns A promise that resolves to an array of songs.
 */
export async function getAllSongs(): Promise<Song[]> {
  const db = await getDb();
  const songs: Song[] = [];

  try {
    const snapshot = await db.collection('songs')
                             .orderBy('created_at', 'desc')
                             .get();

    if (snapshot.empty) {
      return [];
    }

    snapshot.forEach(doc => {
      songs.push({ id: doc.id, ...doc.data() } as Song);
    });
  } catch (error) {
    console.error('Error fetching songs from Firestore:', error);
    throw new Error('Could not retrieve songs from the database.');
  }

  return songs;
}

/**
 * Fetches recently added songs from Firestore.
 * @param count - The number of recent songs to fetch.
 * @returns A promise that resolves to an array of songs.
 */
export async function getRecentSongs(count: number = 12): Promise<Song[]> {
    const db = await getDb();
    const songs: Song[] = [];
  
    try {
      const snapshot = await db.collection('songs')
                               .orderBy('created_at', 'desc')
                               .limit(count)
                               .get();
  
      if (snapshot.empty) {
        return [];
      }
  
      snapshot.forEach(doc => {
        songs.push({ id: doc.id, ...doc.data() } as Song);
      });
    } catch (error) {
      console.error('Error fetching recent songs from Firestore:', error);
      throw new Error('Could not retrieve recent songs from the database.');
    }
  
    return songs;
}

/**
 * Deletes a song from Firestore.
 * @param songId - The ID of the song to delete.
 */
export async function deleteSong(songId: string): Promise<void> {
    const db = await getDb();
    try {
        await db.collection('songs').doc(songId).delete();
    } catch (error) {
        console.error('Error deleting song from Firestore:', error);
        throw new Error('Could not delete the song.');
    }
}

/**
 * Generates a temporary download link for a Dropbox file.
 * NOTE: This is a new function to handle Dropbox downloads securely.
 * @param fileId - The Dropbox file ID.
 * @returns A promise that resolves to a temporary URL.
 */
export async function getDropboxTemporaryLink(fileId: string): Promise<string> {
    const ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN;
    if (!ACCESS_TOKEN) {
        throw new Error('Dropbox access token is not configured.');
    }
    const response = await fetch('https://api.dropboxapi.com/2/files/get_temporary_link', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: fileId }),
    });

    if (!response.ok) {
        console.error('Failed to get temporary link from Dropbox');
        throw new Error('Could not get temporary link.');
    }

    const data = await response.json();
    return data.link;
}

/**
 * Fetches all songs for a specific user from Firestore, ordered by creation date.
 * @param userId - The ID of the user whose songs to fetch.
 * @returns A promise that resolves to an array of songs.
 */
export async function getSongsByUserId(userId: string): Promise<Song[]> {
    const db = await getDb();
    const songs: Song[] = [];
  
    try {
      const snapshot = await db.collection('songs')
                               .where('userId', '==', userId)
                               .orderBy('created_at', 'desc')
                               .get();
  
      if (snapshot.empty) {
        return [];
      }
  
      snapshot.forEach(doc => {
        songs.push({ id: doc.id, ...doc.data() } as Song);
      });
    } catch (error) {
      console.error('Error fetching songs from Firestore:', error);
      throw new Error('Could not retrieve songs from the database.');
    }
  
    return songs;
  }
