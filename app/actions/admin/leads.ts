"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/require-auth";
import { Lead, LeadStatus } from "@prisma/client";
import ExcelJS from "exceljs";

export async function getLeads() {
  await requireAdmin();
  return prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  await requireAdmin();
  await prisma.lead.update({ where: { id }, data: { status } });
  return { success: true };
}

export async function addLeadNote(id: string, note: string) {
  await requireAdmin();
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return { success: false };
  const notes = (lead.notes as { text: string; at: string }[]) ?? [];
  notes.push({ text: note, at: new Date().toISOString() });
  await prisma.lead.update({ where: { id }, data: { notes } });
  return { success: true };
}

export async function exportLeadsCsv() {
  await requireAdmin();
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  const header = "Name,Email,Phone,Company,Status,Source,Created\n";
  const rows = leads
    .map(
      (l: Lead) =>
        `"${l.name}","${l.email}","${l.phone ?? ""}","${l.company ?? ""}","${l.status}","${l.source}","${l.createdAt.toISOString()}"`
    )
    .join("\n");
  return header + rows;
}

export async function exportLeadsExcel() {
  await requireAdmin();
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Leads");
  sheet.columns = [
    { header: "Name", key: "name", width: 20 },
    { header: "Email", key: "email", width: 30 },
    { header: "Phone", key: "phone", width: 15 },
    { header: "Status", key: "status", width: 15 },
    { header: "Created", key: "created", width: 20 },
  ];
  leads.forEach((l: Lead) => {
    sheet.addRow({
      name: l.name,
      email: l.email,
      phone: l.phone,
      status: l.status,
      created: l.createdAt.toISOString(),
    });
  });
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer).toString("base64");
}
