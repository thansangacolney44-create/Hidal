
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
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '../ui/button';

export function SidebarContent() {
  const pathname = usePathname();

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
            <Link href="/" passHref>
              <SidebarMenuButton asChild isActive={pathname === '/'} icon={<Home />}>
                <span>Home</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/library" passHref>
              <SidebarMenuButton asChild isActive={pathname === '/library'} icon={<Library />}>
                 <span>Library</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/upload" passHref>
              <SidebarMenuButton asChild isActive={pathname === '/upload'} icon={<Upload />}>
                <span>Upload Music</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContentArea>
      <SidebarFooter>
         <Button variant="outline" className="w-full" disabled>
            <Plus className="mr-2 h-4 w-4" />
            New Playlist
          </Button>
      </SidebarFooter>
    </>
  );
}
