import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      // If running on the server, we can't process the file.
      // Return a default duration.
      return resolve(0);
    }
    const audio = document.createElement('audio');
    audio.preload = 'metadata';
    audio.onloadedmetadata = () => {
        window.URL.revokeObjectURL(audio.src);
        resolve(Math.round(audio.duration));
    };
    audio.onerror = (e) => {
        console.error("Error loading audio file for duration calculation:", e);
        reject("Could not get audio duration.");
    }
    audio.src = URL.createObjectURL(file);
  });
}
