"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updateLeadStatus, exportLeadsCsv } from "@/app/actions/admin/leads";
import type { Lead, LeadStatus } from "@prisma/client";
import { formatDate } from "@/lib/utils";

const statuses: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "WON",
  "LOST",
];

export function LeadsAdmin({ leads }: { leads: Lead[] }) {
  const [filter, setFilter] = useState<LeadStatus | "ALL">("ALL");

  const filtered =
    filter === "ALL" ? leads : leads.filter((l) => l.status === filter);

  const handleExport = async () => {
    const csv = await exportLeadsCsv();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
  };

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2 mb-6">
        <Button size="sm" variant={filter === "ALL" ? "default" : "outline"} onClick={() => setFilter("ALL")}>
          All
        </Button>
        {statuses.map((s) => (
          <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)}>
            {s}
          </Button>
        ))}
        <Button size="sm" variant="secondary" className="ml-auto" onClick={handleExport}>
          Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left hidden sm:table-cell">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left hidden md:table-cell">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id} className="border-b">
                <td className="p-3">
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-xs text-muted-foreground sm:hidden">{lead.email}</p>
                </td>
                <td className="p-3 hidden sm:table-cell">{lead.email}</td>
                <td className="p-3">
                  <Badge variant="secondary">{lead.status}</Badge>
                </td>
                <td className="p-3 hidden md:table-cell text-muted-foreground">
                  {formatDate(lead.createdAt)}
                </td>
                <td className="p-3">
                  <select
                    className="rounded border bg-background px-2 py-1 text-xs"
                    value={lead.status}
                    onChange={async (e) => {
                      await updateLeadStatus(lead.id, e.target.value as LeadStatus);
                      window.location.reload();
                    }}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
