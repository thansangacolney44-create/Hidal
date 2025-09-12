import PlaylistGenerator from "@/components/media/playlist-generator";

export default function DiscoverPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Discover Weekly</h1>
        <p className="text-muted-foreground mt-2">
          A personalized playlist just for you, powered by AI.
        </p>
      </div>
      <PlaylistGenerator />
    </div>
  );
}
