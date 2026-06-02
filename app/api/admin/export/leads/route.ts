import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { exportLeadsExcel } from "@/app/actions/admin/leads";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const base64 = await exportLeadsExcel();
  const buffer = Buffer.from(base64, "base64");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="leads.xlsx"',
    },
  });
}
