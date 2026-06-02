import { ServicesGrid } from "@/components/marketing/services-grid";
import type { ServiceData } from "@/components/marketing/service-modal";

import { type BlockContent } from "@/lib/cms/blocks";

export function ServicesGridBlock({
  content,
  services,
}: {
  content: BlockContent;
  services: ServiceData[];
  preset: unknown;

}) {
  return (
    <ServicesGrid
      services={services}
      title={(content.title as string) ?? "Our Services"}
      subtitle={content.subtitle as string | undefined}
    />
  );
}
