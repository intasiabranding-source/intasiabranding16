import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SessionProvider } from "next-auth/react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen bg-muted/30">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-4 md:p-8 lg:ml-0">{children}</main>
      </div>
    </SessionProvider>
  );
}
