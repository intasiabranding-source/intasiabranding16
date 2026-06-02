import { getAdminBlogPosts } from "@/app/actions/admin/blog";
import { BlogAdmin } from "@/components/admin/blog-admin";

export default async function AdminBlogPage() {
  const posts = await getAdminBlogPosts();
  return (
    <div>
      <h1 className="text-2xl font-bold">Blog CMS</h1>
      <p className="text-muted-foreground">Create, edit, and schedule blog posts.</p>
      <BlogAdmin posts={posts} />
    </div>
  );
}
