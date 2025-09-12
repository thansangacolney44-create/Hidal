'use server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import type { Media, Playlist } from '@/types';

export async function getMedia(): Promise<Media[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'media'));
    const media: Media[] = [];
    querySnapshot.forEach((doc) => {
      media.push({ id: doc.id, ...doc.data() } as Media);
    });
    return media;
  } catch (e) {
    console.error("Error getting documents: ", e);
    return [];
  }
}

export async function getPlaylists(): Promise<Playlist[]> {
    try {
        const querySnapshot = await getDocs(collection(db, 'playlists'));
        const playlists: Playlist[] = [];
        querySnapshot.forEach((doc) => {
            playlists.push({ id: doc.id, ...doc.data() } as Playlist);
        });
        return playlists;
    } catch (e) {
        console.error("Error getting documents: ", e);
        return [];
    }
}
