import { getPages } from "@/app/actions/admin/cms";
import { PageBuilder } from "@/components/admin/page-builder";

export default async function AdminPagesPage() {
  const pages = await getPages();

  return (
    <div>
      <h1 className="text-2xl font-bold">Page Builder</h1>
      <p className="text-muted-foreground">Edit homepage and landing page sections without code.</p>
      <PageBuilder pages={pages} />
    </div>
  );
}
