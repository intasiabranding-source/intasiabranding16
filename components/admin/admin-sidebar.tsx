"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  Image,
  Users,
  BarChart3,
  Settings,
  Mail,
  Shield,
  Search,
  Menu,
  X,
  Layers,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/content/pages", label: "Pages", icon: Layers },
  { href: "/admin/content/services", label: "Services", icon: Briefcase },
  { href: "/admin/content/blog", label: "Blog", icon: FileText },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/crm/leads", label: "CRM", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/seo", label: "SEO / AEO / GEO", icon: Search },
  { href: "/admin/email/smtp", label: "Email / SMTP", icon: Mail },
  { href: "/admin/security", label: "Security", icon: Shield },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const Nav = () => (
    <nav className="flex flex-col gap-1 p-4">
      {links.map((link) => {
        const Icon = link.icon;
        const active = pathname === link.href || pathname.startsWith(link.href + "/");
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {link.label}
          </Link>
        );
      })}
      <Button
        variant="ghost"
        className="mt-4 justify-start text-muted-foreground"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
      >
        Sign Out
      </Button>
    </nav>
  );

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card transition-transform lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="border-b border-border p-4">
          <p className="font-display text-lg font-bold gradient-text">Admin</p>
          <p className="text-xs text-muted-foreground">Digital Growth CMS</p>
        </div>
        <Nav />
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
