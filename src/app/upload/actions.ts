'use server';

import { suggestAudioFormatConversion } from '@/ai/flows/suggest-audio-format-conversion';
import type { SuggestAudioFormatConversionOutput } from '@/ai/flows/suggest-audio-format-conversion';

const SUPPORTED_FORMATS = ['flac', 'wav', 'aac', 'alac', 'mp3'];

export async function getConversionSuggestion(
  filename: string
): Promise<SuggestAudioFormatConversionOutput | null> {
  const fileType = filename.split('.').pop()?.toLowerCase() ?? '';
  
  if (SUPPORTED_FORMATS.includes(fileType)) {
    // Return null if format is supported, indicating no conversion needed.
    // The AI could still be called here for other insights, but for now we short-circuit.
    return null;
  }

  try {
    const result = await suggestAudioFormatConversion({
      filename,
      fileType,
      supportedFormats: SUPPORTED_FORMATS,
    });
    return result;
  } catch (error) {
    console.error("AI suggestion failed:", error);
    // Return a default suggestion on error
    return {
        shouldConvert: true,
        suggestedFormat: 'MP3',
        reason: `Your file format '.${fileType}' is not supported. We recommend converting it to a standard format like MP3 for compatibility.`,
    }
  }
}
