'use server';
/**
 * @fileOverview An AI agent that suggests audio format conversions.
 *
 * - suggestAudioFormatConversion - A function that handles the audio format conversion suggestion process.
 * - SuggestAudioFormatConversionInput - The input type for the suggestAudioFormatConversion function.
 * - SuggestAudioFormatConversionOutput - The return type for the suggestAudioFormatConversion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAudioFormatConversionInputSchema = z.object({
  filename: z.string().describe('The name of the audio file.'),
  fileType: z.string().describe('The type of the audio file (e.g., mp3, wav, flac).'),
  supportedFormats: z.array(z.string()).describe('A list of audio formats supported by the application.'),
});
export type SuggestAudioFormatConversionInput = z.infer<typeof SuggestAudioFormatConversionInputSchema>;

const SuggestAudioFormatConversionOutputSchema = z.object({
  shouldConvert: z.boolean().describe('Whether the audio file should be converted to a supported format.'),
  suggestedFormat: z.string().optional().describe('The suggested audio format to convert to, if applicable.'),
  reason: z.string().describe('The reason for the suggestion.'),
});
export type SuggestAudioFormatConversionOutput = z.infer<typeof SuggestAudioFormatConversionOutputSchema>;

export async function suggestAudioFormatConversion(input: SuggestAudioFormatConversionInput): Promise<SuggestAudioFormatConversionOutput> {
  return suggestAudioFormatConversionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAudioFormatConversionPrompt',
  input: {schema: SuggestAudioFormatConversionInputSchema},
  output: {schema: SuggestAudioFormatConversionOutputSchema},
  prompt: `You are an AI assistant that helps users determine if they need to convert their audio files to a compatible format.

You will be provided with the filename, file type, and a list of supported formats.

Based on this information, determine if the user should convert their file to a supported format.
If the file type is not in the list of supported formats, you should suggest converting it to a supported format.

Filename: {{{filename}}}
File type: {{{fileType}}}
Supported formats: {{{supportedFormats}}}

Output a JSON object with the following keys:
- shouldConvert: true if the file should be converted, false otherwise.
- suggestedFormat: The suggested format to convert to. This should be one of the supported formats. Only set this if shouldConvert is true.  If there are multiple formats, pick the most common one.
- reason: A brief explanation of why the file should or should not be converted.
`,
});

const suggestAudioFormatConversionFlow = ai.defineFlow(
  {
    name: 'suggestAudioFormatConversionFlow',
    inputSchema: SuggestAudioFormatConversionInputSchema,
    outputSchema: SuggestAudioFormatConversionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
