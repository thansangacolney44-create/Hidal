'use client';

import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { SidebarContent } from '@/components/layout/sidebar-content';
import { MusicPlayer } from '@/components/music/music-player';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="relative flex h-svh flex-col">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar>
            <SidebarContent />
          </Sidebar>
          <div className="flex flex-1 flex-col overflow-hidden">
            <SidebarInset className="flex-1 overflow-y-auto pb-24">
              {children}
            </SidebarInset>
          </div>
        </div>
        <MusicPlayer />
      </div>
    </SidebarProvider>
  );
}
