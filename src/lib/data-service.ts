
'use server';

import type { Song } from '@/types';
import { getAudioDuration } from './utils';
import { supabase } from './supabase-client';

/**
 * Adds a new song to the Supabase database.
 * @param songData - The song metadata (title, artist, album).
 * @param audioFile - The audio file. This will be stored as a data URL.
 * @param coverArtFile - The cover art image file. This will be stored as a data URL.
 * @returns The newly created song object.
 */
export async function addSong(
  songData: Omit<Song, 'id' | 'url' | 'coverArt' | 'duration' | 'created_at'>,
  audioFile: File,
  coverArtFile: File
): Promise<Song> {
    
    // In a real app, you would upload files to a storage provider like Supabase Storage
    // and store the URL. For simplicity in this prototype, we're using data URLs.
    // This can lead to very large database entries and is not recommended for production.
    const fileToDataUrl = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = (e) => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }

    const [url, coverArt, duration] = await Promise.all([
        fileToDataUrl(audioFile),
        fileToDataUrl(coverArtFile),
        getAudioDuration(audioFile)
    ]);

    const newSongData = {
        ...songData,
        url,
        coverArt,
        duration,
    };

    const { data, error } = await supabase
        .from('songs')
        .insert([newSongData])
        .select()
        .single();
    
    if (error) {
        console.error('Error adding song to Supabase:', error);
        throw new Error(`Failed to add song: ${error.message}`);
    }

    return data as Song;
}

/**
 * Fetches all songs from Supabase, ordered by creation date.
 * @returns A promise that resolves to an array of songs.
 */
export async function getAllSongs(): Promise<Song[]> {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching songs from Supabase:', error);
    if (error.code === '42P01') { // "undefined_table"
        throw new Error('The `songs` table does not exist. Please create it in your Supabase project.');
    }
    throw new Error('Could not retrieve songs from the database.');
  }

  return data as Song[];
}

/**
 * Fetches recently added songs from Supabase.
 * @param count - The number of recent songs to fetch.
 * @returns A promise that resolves to an array of songs.
 */
export async function getRecentSongs(count: number = 6): Promise<Song[]> {
    const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(count);

  if (error) {
    console.error('Error fetching recent songs from Supabase:', error);
    if (error.code === '42P01') { // "undefined_table"
        throw new Error('The `songs` table does not exist. Please create it in your Supabase project.');
    }
    throw new Error('Could not retrieve recent songs from the database.');
  }

  return data as Song[];
}
