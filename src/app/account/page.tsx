'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/context/auth-context';
import { useToast } from '@/hooks/use-toast';

export default function AccountPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    
    if (!user) {
        return null;
    }
    
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    const handleEditProfile = () => {
        toast({
            title: "Feature not available",
            description: "Profile editing will be available in a future update."
        });
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tight">Account</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your profile, content, and settings.
                </p>
            </div>
            
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                     <Avatar className="h-20 w-20">
                        <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user avatar" />
                        <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <CardTitle className="text-3xl">{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </div>
                     <Button onClick={handleEditProfile}>Edit Profile</Button>
                </CardHeader>
                <CardContent>
                   <p className="text-muted-foreground">More account settings and content management options will be available here.</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>My Uploads</CardTitle>
                    <CardDescription>View and manage your uploaded media.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">You haven't uploaded any content yet.</p>
                        <Button variant="link" asChild className="mt-2">
                            <a href="/upload">Upload now</a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
