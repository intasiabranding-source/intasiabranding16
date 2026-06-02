"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateCms() {
  revalidateTag("cms");
  revalidatePath("/", "layout");
}

export async function revalidatePage(slug: string) {
  revalidateTag("cms");
  if (slug === "home") {
    revalidatePath("/");
  } else {
    revalidatePath(`/${slug}`);
  }
}
