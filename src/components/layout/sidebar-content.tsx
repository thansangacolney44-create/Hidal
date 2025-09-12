
'use client';

import { usePathname } from 'next/navigation';
import { Home, Library, Upload, Music2, Plus, LogIn, LogOut, DiscAlbum } from 'lucide-react';
import {
  SidebarHeader,
  SidebarContent as SidebarContentArea,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';

export function SidebarContent() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();

  const getInitials = (email: string) => {
    if (!email) return '?';
    return email[0].toUpperCase();
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <Music2 className="text-primary h-8 w-8" />
            <h1 className="text-2xl font-bold text-primary tracking-tighter">HidalWave</h1>
        </div>
      </SidebarHeader>

      <SidebarContentArea>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton href="/" isActive={pathname === '/'} icon={<Home />}>
              Home
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="/library" isActive={pathname === '/library'} icon={<DiscAlbum />}>
              All Music
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="/upload" isActive={pathname === '/upload'} icon={<Upload />}>
              Upload Music
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContentArea>
      <SidebarFooter>
         {loading ? (
            <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
            </div>
         ) : user ? (
            <div className="flex items-center justify-between">
                <div className='flex items-center gap-2 truncate'>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL ?? undefined} />
                        <AvatarFallback>{getInitials(user.email!)}</AvatarFallback>
                    </Avatar>
                    <span className="truncate text-sm font-medium">{user.email}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={signOut} title="Sign Out">
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>
         ) : (
            <Button asChild>
                <a href="/sign-in">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                </a>
            </Button>
         )}
      </SidebarFooter>
    </>
  );
}
