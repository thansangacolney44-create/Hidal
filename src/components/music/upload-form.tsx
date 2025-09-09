'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getConversionSuggestion } from '@/app/upload/actions';
import { Loader2, AlertCircle, UploadCloud, Image as ImageIcon, Music } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { SuggestAudioFormatConversionOutput } from '@/ai/flows/suggest-audio-format-conversion';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import Image from 'next/image';
import { allSongs } from '@/lib/mock-data';
import type { Song } from '@/types';
import { useRouter } from 'next/navigation';

const uploadSchema = z.object({
    title: z.string().min(1, "Title is required"),
    artist: z.string().min(1, "Artist is required"),
    album: z.string().min(1, "Album is required"),
    audioFile: z.instanceof(File).refine(file => file?.size > 0, "An audio file is required."),
    coverArt: z.instanceof(File).refine(file => file?.type.startsWith("image/"), "An image file is required."),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

export function UploadForm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestAudioFormatConversionOutput | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
        title: "",
        artist: "",
        album: "",
    }
  });

  const audioFile = form.watch("audioFile");
  const coverArtFile = form.watch("coverArt");
  const [coverArtPreview, setCoverArtPreview] = useState<string | null>(null);

  useEffect(() => {
    if (coverArtFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setCoverArtPreview(reader.result as string);
        }
        reader.readAsDataURL(coverArtFile);
    } else {
        setCoverArtPreview(null);
    }
  }, [coverArtFile]);

  const handleAudioFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    form.setValue("audioFile", file, { shouldValidate: true });

    setIsProcessing(true);
    setSuggestion(null);

    const result = await getConversionSuggestion(file.name);
    
    if (result?.shouldConvert) {
      setSuggestion(result);
      setIsDialogOpen(true);
    } else if (result) {
      toast({
        title: "File format looks good!",
        description: result.reason,
      });
    }

    setIsProcessing(false);
  };
  
  const handleDialogClose = (open: boolean) => {
    if (!open) {
        setIsDialogOpen(false);
        form.resetField("audioFile");
    }
  }
  
  const handleUploadAnyway = () => {
    setIsDialogOpen(false);
    // The form can now be submitted
  }

  const onSubmit = (data: UploadFormValues) => {
    setIsProcessing(true);
    
    const newSong: Song = {
      id: `uploaded-${Date.now()}`,
      title: data.title,
      artist: data.artist,
      album: data.album,
      duration: 0, // This would require reading the audio file metadata
      url: URL.createObjectURL(data.audioFile),
      coverArt: URL.createObjectURL(data.coverArt)
    };

    allSongs.unshift(newSong);

    toast({
        title: "Upload Successful!",
        description: `${data.title} has been added to your library.`,
    });
    
    form.reset();
    setCoverArtPreview(null);
    setIsProcessing(false);
    router.push('/library');
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
                <FormField
                    control={form.control}
                    name="coverArt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Album Cover</FormLabel>
                            <FormControl>
                                <label className="relative flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted/50 transition-colors">
                                    {coverArtPreview ? (
                                        <Image src={coverArtPreview} alt="Cover art preview" fill className="object-cover rounded-lg" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-center p-4">
                                            <ImageIcon className="w-10 h-10 mb-3 text-muted-foreground" />
                                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span></p>
                                            <p className="text-xs text-muted-foreground">PNG, JPG, GIF</p>
                                        </div>
                                    )}
                                    <Input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                                    />
                                </label>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="md:col-span-2 space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Song Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Cosmic Drift" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="artist"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Artist</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Astro Beats" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="album"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Album</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Galaxy Grooves" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="audioFile"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Audio File</FormLabel>
                            {audioFile ? (
                                <div className="p-3 rounded-md border bg-muted/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Music className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-sm font-medium">{audioFile.name}</span>
                                    </div>
                                    <Button type="button" variant="ghost" size="sm" onClick={() => form.resetField("audioFile")}>Change</Button>
                                </div>
                            ) : (
                                <FormControl>
                                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted/50 transition-colors">
                                        <div className="flex flex-col items-center justify-center">
                                            <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground"><span className="font-semibold">Click to upload audio</span></p>
                                        </div>
                                        <Input id="dropzone-file" type="file" className="hidden" onChange={handleAudioFileChange} accept="audio/*" />
                                    </label>
                                </FormControl>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
          </div>
          
          <Button type="submit" disabled={isProcessing || isDialogOpen} className="w-full md:w-auto">
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" /> }
            Upload to Library
          </Button>
        </form>
      </Form>

      <AlertDialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="text-accent" />
              Unsupported File Format
            </AlertDialogTitle>
            <AlertDialogDescription>
              {suggestion?.reason}
              {suggestion?.suggestedFormat && (
                <p className="mt-2 font-semibold">
                  We suggest converting to: {suggestion.suggestedFormat.toUpperCase()}
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel Upload</AlertDialogCancel>
            <AlertDialogAction onClick={handleUploadAnyway}>Upload Anyway</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
