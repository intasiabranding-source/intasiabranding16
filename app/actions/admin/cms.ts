"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/require-auth";
import { revalidateCms, revalidatePage } from "@/lib/cms/revalidate";
import { logAudit } from "@/lib/auth/audit";
import { defaultBlockContent, type BlockType } from "@/lib/cms/blocks";
import { AnimationPreset, type Prisma } from "@prisma/client";

export async function getPages() {
  await requireAdmin();
  return prisma.page.findMany({
    include: { sections: { orderBy: { order: "asc" } } },
    orderBy: { slug: "asc" },
  });
}

export async function updateSectionContent(
  sectionId: string,
  content: Prisma.InputJsonValue
) {
  const session = await requireAdmin();
  await prisma.pageSection.update({
    where: { id: sectionId },
    data: { content },
  });
  await logAudit({
    adminId: session.user.id,
    action: "UPDATE_SECTION",
    entity: "PageSection",
    entityId: sectionId,
  });
  await revalidateCms();
  return { success: true };
}

export async function addSection(pageId: string, type: BlockType) {
  const session = await requireAdmin();
  const maxOrder = await prisma.pageSection.aggregate({
    where: { pageId },
    _max: { order: true },
  });
  const section = await prisma.pageSection.create({
    data: {
      pageId,
      type,
      order: (maxOrder._max.order ?? -1) + 1,
      content: defaultBlockContent(type),
      animationPreset: AnimationPreset.FADE_UP,
    },
  });
  await logAudit({
    adminId: session.user.id,
    action: "ADD_SECTION",
    entity: "PageSection",
    entityId: section.id,
  });
  await revalidateCms();
  return section;
}

export async function deleteSection(sectionId: string) {
  const session = await requireAdmin();
  await prisma.pageSection.delete({ where: { id: sectionId } });
  await logAudit({
    adminId: session.user.id,
    action: "DELETE_SECTION",
    entity: "PageSection",
    entityId: sectionId,
  });
  await revalidateCms();
  return { success: true };
}

export async function reorderSections(pageId: string, orderedIds: string[]) {
  const session = await requireAdmin();
  await Promise.all(
    orderedIds.map((id, order) =>
      prisma.pageSection.update({ where: { id }, data: { order } })
    )
  );
  await logAudit({
    adminId: session.user.id,
    action: "REORDER_SECTIONS",
    entity: "Page",
    entityId: pageId,
  });
  await revalidateCms();
  return { success: true };
}

export async function publishPage(slug: string) {
  const session = await requireAdmin();
  await prisma.page.update({
    where: { slug },
    data: { published: true },
  });
  await logAudit({
    adminId: session.user.id,
    action: "PUBLISH_PAGE",
    entity: "Page",
    metadata: { slug },
  });
  await revalidatePage(slug === "home" ? "home" : slug);
  return { success: true };
}
