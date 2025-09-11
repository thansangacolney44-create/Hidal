
'use client';

import { UploadForm } from '@/components/music/upload-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HardDriveDownload, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useState, useEffect } from 'react';

export default function UploadPage() {
    const [isDbReady, setIsDbReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            // This is a simple check to see if the Supabase client can be initialized.
            // If the env vars are missing, this will throw an error.
            require('@/lib/supabase-client');
            setIsDbReady(true);
        } catch (error) {
            console.error(error);
            setIsDbReady(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!isDbReady) {
        return (
            <div className="p-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Database Not Connected</AlertTitle>
                    <AlertDescription>
                        Cannot upload music because the application is not connected to a database. Please make sure your Supabase environment variables are set correctly in the `.env` file.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

  return (
      <div className="p-4 sm:p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter">Upload Music</h1>
          <p className="text-muted-foreground max-w-2xl">
            Add your high-resolution audio files to your library. We support FLAC, WAV, AAC, ALAC, and MP3.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
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
                <Button className="w-full" asChild>
                  <Link href="/import/dropbox">
                    <HardDriveDownload className="mr-2 h-4 w-4" />
                    Connect to Dropbox
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}
