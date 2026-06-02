import { getMediaAssets } from "@/app/actions/admin/media";
import { MediaLibrary } from "@/components/admin/media-library";

export default async function AdminMediaPage() {
  const assets = await getMediaAssets();
  return (
    <div>
      <h1 className="text-2xl font-bold">Media Library</h1>
      <p className="text-muted-foreground">Upload and manage images, videos, and assets.</p>
      <MediaLibrary assets={assets} />
    </div>
  );
}
