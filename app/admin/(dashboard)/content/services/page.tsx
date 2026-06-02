import { getAdminServices } from "@/app/actions/admin/services";
import { ServicesAdmin } from "@/components/admin/services-admin";

export default async function AdminServicesPage() {
  const services = await getAdminServices();
  return (
    <div>
      <h1 className="text-2xl font-bold">Services</h1>
      <p className="text-muted-foreground">Manage service catalog, pricing, and modal content.</p>
      <ServicesAdmin services={services} />
    </div>
  );
}
