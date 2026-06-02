"use server";

import { processContactSubmission, type ContactFormInput } from "@/lib/public-api/contact";

export async function submitContactForm(data: ContactFormInput) {
  return processContactSubmission(data);
}
