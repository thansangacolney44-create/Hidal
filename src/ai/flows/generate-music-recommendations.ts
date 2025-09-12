// src/ai/flows/generate-music-recommendations.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating personalized music recommendations.
 *
 * The flow takes a user's listening history as input and returns a list of recommended songs based on the user's preferences and the preferences of similar users.
 * It exports:
 *   - generateMusicRecommendations: The main function to trigger the music recommendation flow.
 *   - GenerateMusicRecommendationsInput: The input type for the generateMusicRecommendations function.
 *   - GenerateMusicRecommendationsOutput: The output type for the generateMusicRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const GenerateMusicRecommendationsInputSchema = z.object({
  userListeningHistory: z.array(
    z.object({
      songTitle: z.string().describe('The title of the song.'),
      artistName: z.string().describe('The name of the artist.'),
      genre: z.string().describe('The genre of the song.'),
    })
  ).describe('The user listening history.'),
  similarUserPreferences: z.array(
    z.object({
      songTitle: z.string().describe('The title of the song.'),
      artistName: z.string().describe('The name of the artist.'),
      genre: z.string().describe('The genre of the song.'),
    })
  ).describe('The preferences of similar users.'),
});

export type GenerateMusicRecommendationsInput = z.infer<typeof GenerateMusicRecommendationsInputSchema>;

// Define the output schema
const GenerateMusicRecommendationsOutputSchema = z.array(
  z.object({
    songTitle: z.string().describe('The title of the recommended song.'),
    artistName: z.string().describe('The name of the artist.'),
    genre: z.string().describe('The genre of the recommended song.'),
    reason: z.string().describe('The reason for recommending this song.'),
  })
).describe('A list of recommended songs.');

export type GenerateMusicRecommendationsOutput = z.infer<typeof GenerateMusicRecommendationsOutputSchema>;

// Define the flow function
export async function generateMusicRecommendations(input: GenerateMusicRecommendationsInput): Promise<GenerateMusicRecommendationsOutput> {
  return generateMusicRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMusicRecommendationsPrompt',
  input: { schema: GenerateMusicRecommendationsInputSchema },
  output: { schema: GenerateMusicRecommendationsOutputSchema },
  prompt: `You are a music recommendation expert. Given a user's listening history and the preferences of similar users, you will provide a list of personalized music recommendations.

  User Listening History:
  {{#each userListeningHistory}}
  - {{songTitle}} by {{artistName}} ({{genre}})
  {{/each}}

  Similar User Preferences:
  {{#each similarUserPreferences}}
  - {{songTitle}} by {{artistName}} ({{genre}})
  {{/each}}

  Based on this information, recommend songs that the user might enjoy. Provide a reason for each recommendation.
  Ensure the output is a JSON array of song recommendations.
  `, // Crucially, a new line character (\n) is included at the end of the prompt to ensure the last line is sent.
});

const generateMusicRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateMusicRecommendationsFlow',
    inputSchema: GenerateMusicRecommendationsInputSchema,
    outputSchema: GenerateMusicRecommendationsOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
