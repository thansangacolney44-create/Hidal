'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { uploadAndCreateMedia } from './actions';
import { useRouter } from 'next/navigation';
import { Loader2, UploadCloud } from 'lucide-react';

const formSchema = z.object({
    type: z.enum(['audio', 'video']),
    title: z.string().min(1, 'Title is required'),
    artist: z.string().min(1, 'Artist is required'),
    mediaFile: z.instanceof(File).refine(file => file.size > 0, 'Media file is required.'),
    albumArtFile: z.instanceof(File).refine(file => file.size > 0, 'Album art is required.'),
    imageHint: z.string().max(20, 'Hint must be 20 characters or less.').optional(),
    duration: z.coerce.number().positive('Duration must be a positive number.'),
});

export default function UploadPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const mediaFileRef = React.useRef<HTMLInputElement>(null);
    const artFileRef = React.useRef<HTMLInputElement>(null);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: 'audio',
            title: '',
            artist: '',
            imageHint: '',
            duration: 0,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (value) {
                formData.append(key, String(value));
            }
        });
        
        try {
            await uploadAndCreateMedia(formData);
            toast({
                title: 'Upload Successful',
                description: `${values.title} has been added to your library.`,
            });
            router.push('/');
        } catch (error) {
            toast({
                title: 'Upload Failed',
                description: 'Something went wrong. Please try again.',
                variant: 'destructive',
            });
            console.error("Upload failed", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div>
                <h1 className="text-4xl font-bold tracking-tight">Upload Content</h1>
                <p className="text-muted-foreground mt-2">
                   Add your media by uploading files from your computer. They will be stored in your Dropbox.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>New Media</CardTitle>
                    <CardDescription>Fill out the details for your new upload.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Content Type</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex gap-4"
                                            >
                                                <FormItem className="flex items-center space-x-2">
                                                    <FormControl>
                                                        <RadioGroupItem value="audio" id="r-audio" />
                                                    </FormControl>
                                                    <Label htmlFor="r-audio">Audio</Label>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-2">
                                                    <FormControl>
                                                        <RadioGroupItem value="video" id="r-video" />
                                                    </FormControl>
                                                    <Label htmlFor="r-video">Video</Label>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Celestial Echo" {...field} />
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
                                            <Input placeholder="e.g., Stellar Drifters" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               <FormField
                                    control={form.control}
                                    name="mediaFile"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Media File</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="file" 
                                                    accept="audio/*,video/*"
                                                    className="hidden"
                                                    ref={mediaFileRef}
                                                    onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                                                />
                                            </FormControl>
                                            <Button type="button" variant="outline" className="w-full" onClick={() => mediaFileRef.current?.click()}>
                                                <UploadCloud className="mr-2 h-4 w-4" />
                                                Choose Media File
                                            </Button>
                                            {field.value && <FormDescription>File selected: {field.value.name}</FormDescription>}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="albumArtFile"
                                    render={({ field }) => (
                                       <FormItem>
                                            <FormLabel>Album Art</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    ref={artFileRef}
                                                     onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                                                 />
                                            </FormControl>
                                            <Button type="button" variant="outline" className="w-full" onClick={() => artFileRef.current?.click()}>
                                                <UploadCloud className="mr-2 h-4 w-4" />
                                                Choose Image
                                            </Button>
                                            {field.value && <FormDescription>Image selected: {field.value.name}</FormDescription>}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                             <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duration (in seconds)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="e.g., 185" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="imageHint"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image Hint (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., retro wave" {...field} />
                                        </FormControl>
                                        <FormDescription>Two keywords describing the album art for AI.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <Button type="submit" size="lg" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Upload and Add Media
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
