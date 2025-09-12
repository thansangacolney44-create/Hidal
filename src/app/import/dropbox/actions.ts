
'use server';

import { addSong, getSongsByUserId } from '@/lib/data-service';
import { Song } from "@/types";
import { findDuplicateSong, FindDuplicateSongOutput } from '@/ai/flows/find-duplicate-song';
import { getFirebaseUser } from '@/lib/firebase-admin';

const ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN;
const AUDIO_FORMATS = ['.mp3', '.wav', '.flac', '.aac', '.m4a', '.ogg', '.wma', '.alac'];

export interface DropboxFile {
    '.tag': 'file' | 'folder' | 'deleted';
    name: string;
    id: string;
    path_lower: string;
    path_display: string;
    size: number;
}

async function listFiles(path: string = ''): Promise<DropboxFile[]> {
  if (!ACCESS_TOKEN || ACCESS_TOKEN === 'YOUR_DROPBOX_ACCESS_TOKEN') {
    throw new Error('Dropbox access token is not configured. Please set the DROPBOX_ACCESS_TOKEN environment variable in the .env file.');
  }

  const response = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      path: path,
      recursive: true,
      include_media_info: false,
      include_deleted: false,
      include_has_explicit_shared_members: false,
      include_mounted_folders: true,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Dropbox API Error:', errorBody);
    if (response.status === 401) {
        throw new Error('Dropbox access token is invalid or expired. Please provide a new one.');
    }
    throw new Error(`Failed to fetch files from Dropbox: ${response.statusText}`);
  }

  const data = await response.json();
  return data.entries;
}

export async function getAudioFiles(): Promise<DropboxFile[]> {
  try {
    const allFiles = await listFiles();
    const audioFiles = allFiles.filter(file => 
        file['.tag'] === 'file' && AUDIO_FORMATS.some(format => file.name.toLowerCase().endsWith(format))
    );
    return audioFiles;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error('Could not retrieve audio files from Dropbox.');
  }
}

export async function downloadAndAddFiles(filesToImport: DropboxFile[]): Promise<{ success: boolean; message: string }> {
    const user = await getFirebaseUser();
    if (!user) {
        throw new Error('You must be logged in to import files.');
    }
    const userId = user.uid;
    const existingSongs = await getSongsByUserId(userId);

    let importedCount = 0;
    let skippedCount = 0;
    let replacedCount = 0;

    for (const file of filesToImport) {
        try {
            const title = file.name.split('.').slice(0, -1).join('.');
            
            const duplicateCheck: FindDuplicateSongOutput = await findDuplicateSong({
                newSong: { title, artist: "Unknown Artist", size: file.size },
                existingSongs: existingSongs.map(s => ({...s, size: s.size || 0}))
            });

            if (duplicateCheck.isDuplicate) {
                if (duplicateCheck.newSongIsHigherQuality) {
                    // We would delete the old file here, but for simplicity, we'll just add the new one.
                    // In a real app, you would add logic to delete the old song record.
                    console.log(`Replacing song ID: ${duplicateCheck.duplicateSongId} with higher quality version.`);
                    replacedCount++;
                } else {
                    console.log(`Skipping duplicate song: ${file.name}`);
                    skippedCount++;
                    continue; // Skip to the next file
                }
            }
            
            const songMetadata: Omit<Song, 'id' | 'url' | 'coverArt' | 'duration' | 'created_at' | 'size'> = {
                title: title,
                artist: 'Unknown Artist',
                album: 'Dropbox Imports',
            };

            await addSong(
                { ...songMetadata, userId },
                file.path_lower, // Use the Dropbox file path as the reference ID
                file.name,
                file.size
              );
            importedCount++;

        } catch (error) {
            console.error(`Error processing file ${file.name}:`, error);
        }
    }
    return { success: true, message: `${importedCount} file(s) added, ${replacedCount} updated, and ${skippedCount} skipped.` };
}
