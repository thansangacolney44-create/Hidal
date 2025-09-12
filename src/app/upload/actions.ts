'use server';

import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { z } from 'zod';
import { Dropbox } from 'dropbox';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
    type: z.enum(['audio', 'video']),
    title: z.string().min(1, 'Title is required'),
    artist: z.string().min(1, 'Artist is required'),
    albumArtFile: z.instanceof(File),
    mediaFile: z.instanceof(File),
    imageHint: z.string().max(20, 'Hint must be 20 characters or less.').optional(),
    duration: z.coerce.number().positive('Duration must be a positive number.'),
});

const getSharedLink = async (dbx: Dropbox, path: string) => {
    try {
        const sharedLink = await dbx.sharingCreateSharedLinkWithSettings({ path });
        // Transform the link to a direct download link
        return sharedLink.result.url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').split('?')[0];
    } catch (error: any) {
        // If a shared link already exists, get it
        if (error.error?.error['.tag'] === 'shared_link_already_exists') {
            const links = await dbx.sharingListSharedLinks({ path, direct_only: true });
            const existingLink = links.result.links[0];
            if (existingLink) {
                 return existingLink.url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').split('?')[0];
            }
        }
        throw error;
    }
}


export async function uploadAndCreateMedia(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    
    // Validate text fields
    const validatedFields = formSchema.omit({ albumArtFile: true, mediaFile: true }).safeParse(rawData);
    if (!validatedFields.success) {
        console.error('Validation failed:', validatedFields.error.flatten().fieldErrors);
        throw new Error('Invalid form data.');
    }
    
    const { title, artist, type, duration, imageHint } = validatedFields.data;

    // Validate file fields
    const albumArtFile = formData.get('albumArtFile');
    const mediaFile = formData.get('mediaFile');

    if (!(albumArtFile instanceof File) || albumArtFile.size === 0) {
        throw new Error('Album art file is required.');
    }
    if (!(mediaFile instanceof File) || mediaFile.size === 0) {
        throw new Error('Media file is required.');
    }

    const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
    const now = Date.now();

    try {
        // 1. Upload Album Art
        const albumArtPath = `/${now}_${albumArtFile.name}`;
        await dbx.filesUpload({
            path: albumArtPath,
            contents: await albumArtFile.arrayBuffer()
        });
        const albumArtUrl = await getSharedLink(dbx, albumArtPath);

        // 2. Upload Media File
        const mediaFilePath = `/${now}_${mediaFile.name}`;
        await dbx.filesUpload({
            path: mediaFilePath,
            contents: await mediaFile.arrayBuffer()
        });
        const fileUrl = await getSharedLink(dbx, mediaFilePath);

        // 3. Add to Firestore
        const mediaData = {
            type,
            title,
            artist,
            duration,
            imageHint: imageHint || '',
            albumArtUrl,
            fileUrl,
        };

        const docRef = await addDoc(collection(db, 'media'), mediaData);
        
        // Revalidate cache for home page to show new media
        revalidatePath('/');

        return { success: true, id: docRef.id };

    } catch (e) {
        console.error("Error processing upload: ", e);
        throw new Error('Failed to process upload.');
    }
}
