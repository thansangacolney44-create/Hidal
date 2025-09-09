import { AppLayout } from '@/components/layout/app-layout';
import { UploadForm } from '@/components/music/upload-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function UploadPage() {
  return (
    <AppLayout>
      <div className="p-4 sm:p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter">Upload Music</h1>
          <p className="text-muted-foreground max-w-2xl">
            Add your high-resolution audio files to your library. We support FLAC, WAV, AAC, ALAC, and MP3 (320kbps+).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Upload from your device</CardTitle>
                <CardDescription>
                  Drag and drop your files here or click to browse.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UploadForm />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="bg-card/50 border-dashed">
              <CardHeader>
                <CardTitle>Import from Dropbox</CardTitle>
                <CardDescription>
                  Connect your Dropbox account to directly access your music.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary" asChild>
                  <Link href="/import/dropbox">
                    <span>
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                        <path d="M8 3.513l-4.063 2.56L8 8.633l4.063-2.56L8 3.513zM3.937 6.072L0 8.633l4.063 2.56 3.937-2.56-4.063-2.56z m0 5.12l-3.937-2.56L3.937 11.193l4.063 2.56-4.063-2.56z m8.126-5.12L16 8.633l-4.063 2.56-3.937-2.56 4.063-2.56z m0 5.12l3.937-2.56-3.937 2.56-4.063 2.56 4.063-2.56z"/>
                      </svg>
                      Connect to Dropbox
                    </span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
