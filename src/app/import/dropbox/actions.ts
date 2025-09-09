
'use server';

import { allSongs } from "@/lib/mock-data";
import { Song } from "@/types";

// In a real application, you would use a secure way to store and retrieve the access token.
const ACCESS_TOKEN = 'sl.u.AF9RI6DMMoayxfTgn6AmKcZTKBJDnp-px1DiNt_kH8742hFncQEgQ5c1r-k4JkHqRkOZqOSXiIe097TFMoGYnILFJM3bVkvb9A7NzfdVCAqx6v-Dy98lrDVcBjDrFMcJJ8it4emJn4ADPsydmTEkCaXO-6MdTtYkHFYAY_XxZxgJYbn4gd6QHo-ND_rVMY_c0PStNMLoI2nPwbDPlc7AD58LlWzxmjx51xfdEa6R4XSn3d5kmyV_eaP4pY0wXXLXPc-gc7FN1AAgMBr1_nn9ARD_iUEtJP1DIoUgy3hj19R-MjA1X3R0QB4j5ShFH9vnFk_N31wpTAlaD4l5H_JBmllJ1fpJVurXJURqmwuwObV_n1MM1JId0ugecAil_edi2qvGA-uUdnpbZWPc-FI0mo4UarQ-JWsFkBp6MGj9BHPwAZJ3mA_wACJXVtHKZXKmmHqb6Fxz-uLkLeHtO_7yGI97LcjCVZ39BO8sHLJNCsek9E_yFUy1Vq03EtCLDP721rlDOryWWznOh0z9k--9oiyRaqnu7kLW71H7V1wy6n1FXggXtZo2XNUHQ9Cn2m8R6teGi_wHs2vtw2VUsuZm-bQWKkJMyJM3WCyY1_1XX1mIK5_V-oNcB3DZXPJyXhW3Qlc30ZVmzpq83Bd8gj0_QcwV4z_i3-XaAFC0PEe3o41w-cbyITZLxNy4ey6lu-fgl1whFGU-8Ucxx2b8FXm4wpgJcmJf1i5s7bgaj1joIB1SjCYNsopHqyWFjt2eE7rv3rU4DtS1YKnKizYNruIzw3RXC0s8eU7gis9Cd2vCFB7bgD7dyL_Pt8M1Fy9d2idX-uMLrB8Ssg9TOlvmwubVowiC5FNR6uJ4finSCex5Lw3y2bvEbhDJ2rQeODDlztnNEoej_2uzzXZGibLSTf95e7B_zmO9drUPMRHM0yYaPxKseDInqcXGDxdJEgGbcreg9mbmu9DDtEVcMIWcn9vkJax09lb4x8GXeHZUpGsTSuQ0LTuUZl5-LJhCnlDMt7HQtnjiMRomUQtveUTEM2as53SFagGkPPtB0jhJU7NvbeLJK-T_KUUUugVdoWbQbU5WkweuebQwibR26CExnky0b1n5MtwhRJIlU_xBCQfGjpH4as9_DH9CIH5z5vd9lxnxF-XPr3ZBY7YP3tcYtHwkWjuwQZt7LWkTEpO0VgA4T0F_3LApSc9cYRsKwV1UHu1TS7eL2biV1Z1K8wFxcXks-jibcA_BEP9BsNRFZBah-n9VoGYj6I9pQ9Q8BLDbS__EethKWvcjx0Y7X8HIwu8lrciG';
const AUDIO_FORMATS = ['.mp3', '.wav', '.flac', '.aac', '.m4a', '..ogg', '.wma', '.alac'];

export interface DropboxFile {
    '.tag': 'file' | 'folder' | 'deleted';
    name: string;
    id: string;
    path_lower: string;
    path_display: string;
    size: number;
}

async function listFiles(path: string = ''): Promise<DropboxFile[]> {
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
            const fileUrl = URL.createObjectURL(blob);

            // This is mock metadata. In a real app you'd extract it from the file or have the user input it.
            const newSong: Song = {
                id: `db-${file.id}`,
                title: file.name.split('.').slice(0, -1).join('.'),
                artist: 'Unknown Artist',
                album: 'Dropbox Imports',
                duration: 0, // Would need to get this from the audio file data
                url: fileUrl,
                coverArt: `https://picsum.photos/seed/${file.id}/500/500`,
            };
            
            // Check if song already exists
            if (!allSongs.find(s => s.id === newSong.id)) {
                 allSongs.unshift(newSong); // Add to the beginning of the list
            }

        } catch (error) {
            console.error(`Error processing file ${file.name}:`, error);
        }
    }
    return { success: true, message: `${filesToImport.length} file(s) have been added to your library.` };
}
