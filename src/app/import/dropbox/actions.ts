
'use server';

import { addSong } from '@/lib/data-service';
import { Song } from "@/types";

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
  if (!ACCESS_TOKEN) {
    throw new Error('Dropbox access token is not configured. Please set the DROPBOX_ACCESS_TOKEN environment variable.');
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
    if (!ACCESS_TOKEN) {
        throw new Error('Dropbox access token is not configured.');
    }

    for (const file of filesToImport) {
        try {
            const response = await fetch('https://content.dropboxapi.com/2/files/download', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Dropbox-API-Arg': JSON.stringify({ path: file.id }),
                }
            });

            if (!response.ok) {
                console.error(`Failed to download ${file.name}`);
                continue; // Skip to next file
            }

            const blob = await response.blob();
            const audioFile = new File([blob], file.name, { type: blob.type });

            // For cover art, we'll use a placeholder since we can't extract it from the audio.
            const coverArtResponse = await fetch(`https://picsum.photos/seed/${file.id}/500/500`);
            const coverArtBlob = await coverArtResponse.blob();
            const coverArtFile = new File([coverArtBlob], "cover.jpg", { type: "image/jpeg" });
            
            const songMetadata = {
                title: file.name.split('.').slice(0, -1).join('.'),
                artist: 'Unknown Artist',
                album: 'Dropbox Imports',
            };

            await addSong(songMetadata, audioFile, coverArtFile);

        } catch (error) {
            console.error(`Error processing file ${file.name}:`, error);
        }
    }
    return { success: true, message: `${filesToImport.length} file(s) have been added to your library.` };
}
