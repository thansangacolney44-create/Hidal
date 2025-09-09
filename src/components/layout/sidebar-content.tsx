

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Library, Music, Plus, Upload, Music2, Droplets } from 'lucide-react';
import {
  SidebarHeader,
  SidebarContent as SidebarContentArea,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { usePlaylists } from '@/lib/mock-data';
import { Button } from '../ui/button';

export function SidebarContent() {
  const pathname = usePathname();
  const playlists = usePlaylists();

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
            <Link href="/">
              <SidebarMenuButton isActive={pathname === '/'} icon={<Home />}>
                Home
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/library">
              <SidebarMenuButton isActive={pathname === '/library'} icon={<Library />}>
                Library
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/upload">
              <SidebarMenuButton isActive={pathname === '/upload'} icon={<Upload />}>
                Upload Music
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarGroup>
          <SidebarGroupLabel>Playlists</SidebarGroupLabel>
          <SidebarMenu>
            {playlists.map((playlist) => (
              <SidebarMenuItem key={playlist.id}>
                <Link href={`/playlists/${playlist.id}`}>
                   <SidebarMenuButton isActive={pathname === `/playlists/${playlist.id}`} icon={<Music />}>
                      {playlist.name}
                   </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContentArea>
      <SidebarFooter>
         <Button variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            New Playlist
          </Button>
      </SidebarFooter>
    </>
  );
}
