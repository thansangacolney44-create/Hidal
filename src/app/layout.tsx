import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { MusicPlayerProvider } from '@/contexts/music-player-context';

export const metadata: Metadata = {
  title: 'HidalWave',
  description: 'High-fidelity music streaming',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').then(registration => {
                    console.log('Service Worker registered: ', registration);
                  }).catch(registrationError => {
                    console.log('Service Worker registration failed: ', registrationError);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body className="font-body antialiased">
        <MusicPlayerProvider>
          {children}
        </MusicPlayerProvider>
        <Toaster />
      </body>
    </html>
  );
}
