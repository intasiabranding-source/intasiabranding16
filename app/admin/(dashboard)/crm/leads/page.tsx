import { getLeads } from "@/app/actions/admin/leads";
import { LeadsAdmin } from "@/components/admin/leads-admin";

export default async function AdminLeadsPage() {
  const leads = await getLeads();
  return (
    <div>
      <h1 className="text-2xl font-bold">Lead Management CRM</h1>
      <p className="text-muted-foreground">Track and manage contact requests and consultations.</p>
      <LeadsAdmin leads={leads} />
    </div>
  );
}
