
'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { HardDriveDownload, Loader2, Music } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAudioFiles, downloadAndAddFiles, type DropboxFile } from './actions';
import { useRouter } from 'next/navigation';

export default function DropboxImportPage() {
  const [files, setFiles] = useState<DropboxFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchFiles() {
      try {
        setLoading(true);
        setError(null);
        const audioFiles = await getAudioFiles();
        setFiles(audioFiles);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchFiles();
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFiles(files.map(f => f.id));
    } else {
      setSelectedFiles([]);
    }
  };

  const handleSelectFile = (fileId: string, checked: boolean) => {
    if (checked) {
      setSelectedFiles(prev => [...prev, fileId]);
    } else {
      setSelectedFiles(prev => prev.filter(id => id !== fileId));
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    
    const filesToImport = files.filter(f => selectedFiles.includes(f.id));

    try {
        const result = await downloadAndAddFiles(filesToImport);
        if (result.success) {
            toast({
                title: 'Import Complete',
                description: result.message,
            });
            setSelectedFiles([]);
            // Optional: Redirect to library page after import
            router.push('/library');
        } else {
             toast({
                title: 'Import Failed',
                description: result.message,
                variant: 'destructive'
            });
        }
    } catch (err) {
        if (err instanceof Error) {
            toast({
                title: 'Import Error',
                description: err.message,
                variant: 'destructive'
            });
        }
    } finally {
        setIsImporting(false);
    }
  }

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter">Import from Dropbox</h1>
          <p className="text-muted-foreground max-w-2xl">
            Select the audio files you want to add to your HidalWave library.
          </p>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Your Dropbox Audio Files</CardTitle>
                <CardDescription>Found {files.length} audio files.</CardDescription>
            </div>
            <Button onClick={handleImport} disabled={selectedFiles.length === 0 || isImporting}>
                {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <HardDriveDownload className="mr-2 h-4 w-4" />}
                <span>Import {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}</span>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="text-destructive-foreground bg-destructive/80 p-4 rounded-md">{error}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedFiles.length > 0 && selectedFiles.length === files.length && files.length > 0}
                        onCheckedChange={(e) => handleSelectAll(e === true)}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Size</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map(file => (
                    <TableRow key={file.id}>
                      <TableCell>
                        <Checkbox 
                            checked={selectedFiles.includes(file.id)}
                            onCheckedChange={(checked) => handleSelectFile(file.id, !!checked)}
                        />
                      </TableCell>
                      <TableCell className="font-medium flex items-center gap-3">
                        <Music className="h-5 w-5 text-muted-foreground" />
                        {file.name}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatBytes(file.size)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
