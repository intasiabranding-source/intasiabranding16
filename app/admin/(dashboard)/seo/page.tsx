import { getSeoSettings, getAeoGeoBlocks } from "@/app/actions/admin/settings";
import { SeoAdmin } from "@/components/admin/seo-admin";

export default async function AdminSeoPage() {
  const [seo, aeoGeo] = await Promise.all([getSeoSettings(), getAeoGeoBlocks()]);
  return (
    <div>
      <h1 className="text-2xl font-bold">SEO / AEO / GEO</h1>
      <p className="text-muted-foreground">Meta tags, schema markup, and answer engine optimization.</p>
      <SeoAdmin seoSettings={seo} aeoGeoBlocks={aeoGeo} />
    </div>
  );
}
