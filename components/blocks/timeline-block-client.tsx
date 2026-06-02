"use client";

import { useEffect, useRef } from "react";
import { AnimatedSection } from "@/components/marketing/animated-section";
import { AnimationPreset } from "@prisma/client";
import { type BlockContent } from "@/lib/cms/blocks";

export function TimelineBlockClient({
  events,
  content,
  preset,
}: {
  events: { id: string; year: string; title: string; description: string }[];
  content: BlockContent;
  preset: AnimationPreset;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        if (!ref.current) return;
        gsap.fromTo(
          ref.current.querySelectorAll(".timeline-item"),
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.2,
            scrollTrigger: { trigger: ref.current, start: "top 80%" },
          }
        );
      });
    });
  }, []);

  return (
    <AnimatedSection className="section-padding" preset={preset}>
      <div ref={ref} className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-h2 font-display font-bold">
          {(content.title as string) ?? "Our Journey"}
        </h2>
        <div className="relative mt-12 border-l-2 border-primary/30 pl-8">
          {events.map((event) => (
            <div key={event.id} className="timeline-item relative mb-10">
              <div className="absolute -left-[41px] h-4 w-4 rounded-full bg-primary" />
              <span className="text-sm font-bold text-primary">{event.year}</span>
              <h3 className="mt-1 font-semibold">{event.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
