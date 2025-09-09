'use client'

import { useMusicPlayer } from "@/contexts/music-player-context"
import { Playlist } from "@/types"
import { Button, ButtonProps } from "../ui/button"
import { Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlayButtonProps extends ButtonProps {
    playlist: Playlist,
    trackIndex?: number
}

export function PlayButton({ playlist, trackIndex = 0, variant = "default", size="icon", className, ...props }: PlayButtonProps) {
    const { loadPlaylist, togglePlayPause, isPlaying, currentTrack, playlist: currentPlaylist } = useMusicPlayer()
    
    const isActive = currentPlaylist?.id === playlist.id && (trackIndex === undefined || currentTrack?.id === playlist.songs[trackIndex].id)

    const handlePlay = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isActive) {
            togglePlayPause()
        } else {
            loadPlaylist(playlist, trackIndex)
        }
    }

    return (
        <Button 
            variant={variant} 
            size={size} 
            onClick={handlePlay}
            className={cn("rounded-full", className)}
            {...props}
        >
            {isActive && isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
    )
}
