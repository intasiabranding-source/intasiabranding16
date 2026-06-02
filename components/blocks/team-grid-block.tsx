import Image from "next/image";
import { AnimatedSection } from "@/components/marketing/animated-section";
import { AnimationPreset } from "@prisma/client";
import { type BlockContent } from "@/lib/cms/blocks";
import { prisma } from "@/lib/db";

export async function TeamGridBlock({
  content,
  preset,
}: {
  content: BlockContent;
  preset: AnimationPreset;
}) {
  const team = await prisma.teamMember.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return (
    <AnimatedSection className="section-padding" preset={preset}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-h2 font-display font-bold">
          {(content.title as string) ?? "Our Team"}
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member: { id: string; name: string; role: string; bio: string | null; imageUrl: string | null }) => (
            <div key={member.id} className="text-center">
              <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-2xl">
                <Image
                  src={member.imageUrl ?? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="mt-4 font-semibold">{member.name}</h3>
              <p className="text-sm text-primary">{member.role}</p>
              {member.bio && (
                <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
