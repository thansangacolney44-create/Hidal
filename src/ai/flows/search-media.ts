'use server';
/**
 * @fileOverview This file defines a Genkit flow for searching media.
 *
 * It provides an intelligent search that can understand natural language queries,
 * including abbreviations and synonyms, to find relevant media items.
 *
 * It exports:
 *  - searchMedia: The main function to trigger the search flow.
 *  - SearchMediaInput: The input type for the searchMedia function.
 *  - SearchMediaOutput: The output type for the searchMedia function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define a schema for a single media item for the purpose of the flow
const MediaSchema = z.object({
  id: z.string().describe('The unique identifier for the media item.'),
  title: z.string().describe('The title of the song or video.'),
  artist: z.string().describe('The name of the artist.'),
  type: z.enum(['audio', 'video']).describe('The type of media.'),
  albumArtUrl: z.string().url().describe('URL for the album art.'),
  imageHint: z.string().optional().describe('Hint for the album art image.'),
  fileUrl: z.string().url().describe('URL for the media file.'),
  duration: z.number().positive().describe('Duration in seconds.'),
});

// Define the input schema for the search flow
const SearchMediaInputSchema = z.object({
  query: z.string().describe('The user\'s search query. This can be natural language, e.g., "songs by stellar" or "ily".'),
  media: z.array(MediaSchema).describe('The full list of media items available to search from.'),
});
export type SearchMediaInput = z.infer<typeof SearchMediaInputSchema>;

// Define the output schema for the search flow
const SearchMediaOutputSchema = z.array(MediaSchema).describe('An array of media items that are relevant to the search query.');
export type SearchMediaOutput = z.infer<typeof SearchMediaOutputSchema>;

// Define the exported search function that invokes the Genkit flow
export async function searchMedia(input: SearchMediaInput): Promise<SearchMediaOutput> {
  return searchMediaFlow(input);
}

// Define the AI prompt for the search
const prompt = ai.definePrompt({
  name: 'searchMediaPrompt',
  input: { schema: SearchMediaInputSchema },
  output: { schema: SearchMediaOutputSchema },
  prompt: `You are an intelligent search engine for a music and video platform called Hifier.
Your task is to find media items that are relevant to a user's search query.
You should be able to handle typos, synonyms, and natural language. For example, if a user searches for "ily", you should know they mean "i love you".

Search Query: "{{query}}"

Available Media Library:
{{#each media}}
- ID: {{id}}, Title: "{{title}}", Artist: "{{artist}}"
{{/each}}

Based on the query, return an array of the most relevant media objects from the provided library.
The results should be ordered by relevance. If there are no relevant results, return an empty array.
Only return media items that exist in the provided library.
`,
});

// Define the Genkit flow for the search functionality
const searchMediaFlow = ai.defineFlow(
  {
    name: 'searchMediaFlow',
    inputSchema: SearchMediaInputSchema,
    outputSchema: SearchMediaOutputSchema,
  },
  async (input) => {
    // If the query is empty, return an empty array immediately to save resources.
    if (!input.query.trim()) {
      return [];
    }
    
    const { output } = await prompt(input);
    return output || [];
  }
);
