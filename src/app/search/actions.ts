'use server';

import { searchMedia as genkitSearch } from '@/ai/flows/search-media';
import type { Media } from '@/types';

/**
 * Searches for media based on a query.
 * @param query The search query.
 * @param mediaList The list of media to search through.
 * @returns A promise that resolves to an array of media matching the search.
 */
export async function searchMedia(query: string, mediaList: Media[]): Promise<Media[]> {
  try {
    const searchResults = await genkitSearch({ query, media: mediaList });
    return searchResults;
  } catch (error) {
    console.error('Error searching media:', error);
    // Return an empty array in case of an error to prevent crashing the client.
    return [];
  }
}
