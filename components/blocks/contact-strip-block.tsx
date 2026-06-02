import Link from "next/link";
import { AnimatedSection } from "@/components/marketing/animated-section";
import { AnimationPreset } from "@prisma/client";
import { type BlockContent } from "@/lib/cms/blocks";
import { getSiteSettings } from "@/lib/cms/fetch";
import { Mail, Phone, MapPin } from "lucide-react";

export async function ContactStripBlock({
  preset,
}: {
  content: BlockContent;
  preset: AnimationPreset;
}) {

  const settings = await getSiteSettings();

  return (
    <AnimatedSection className="section-padding border-y border-border" preset={preset}>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-8 px-4 sm:px-6 lg:px-8">
        {settings.contactEmail && (
          <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <Mail className="h-5 w-5 text-primary" />
            {settings.contactEmail}
          </a>
        )}
        {settings.contactPhone && (
          <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <Phone className="h-5 w-5 text-primary" />
            {settings.contactPhone}
          </a>
        )}
        {settings.address && (
          <span className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-5 w-5 text-primary" />
            {settings.address}
          </span>
        )}
        {settings.whatsapp && (
          <Link href={settings.whatsapp} className="text-primary hover:underline">
            WhatsApp
          </Link>
        )}
      </div>
    </AnimatedSection>
  );
}
