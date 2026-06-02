"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/require-auth";
import { revalidateCms } from "@/lib/cms/revalidate";
import { logAudit } from "@/lib/auth/audit";
import { slugify } from "@/lib/utils";
import { BlogStatus } from "@prisma/client";

export async function getAdminBlogPosts() {
  await requireAdmin();
  return prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" } });
}

export async function upsertBlogPost(data: {
  id?: string;
  title: string;
  excerpt?: string;
  content: object;
  coverImage?: string;
  category?: string;
  tags?: string[];
  status?: BlogStatus;
  scheduledFor?: Date;
  metaTitle?: string;
  metaDescription?: string;
}) {
  const session = await requireAdmin();
  const slug = slugify(data.title);

  const payload = {
    title: data.title,
    slug,
    excerpt: data.excerpt,
    content: data.content,
    coverImage: data.coverImage,
    category: data.category,
    tags: data.tags ?? [],
    status: data.status ?? BlogStatus.DRAFT,
    scheduledFor: data.scheduledFor,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    publishedAt:
      data.status === BlogStatus.PUBLISHED ? new Date() : undefined,
  };

  const post = data.id
    ? await prisma.blogPost.update({ where: { id: data.id }, data: payload })
    : await prisma.blogPost.create({ data: payload });

  await logAudit({
    adminId: session.user.id,
    action: data.id ? "UPDATE_BLOG" : "CREATE_BLOG",
    entity: "BlogPost",
    entityId: post.id,
  });
  await revalidateCms();
  return post;
}

export async function deleteBlogPost(id: string) {
  const session = await requireAdmin();
  await prisma.blogPost.delete({ where: { id } });
  await logAudit({
    adminId: session.user.id,
    action: "DELETE_BLOG",
    entity: "BlogPost",
    entityId: id,
  });
  await revalidateCms();
  return { success: true };
}
