"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimationPreset } from "@prisma/client";
import { ReactNode } from "react";

const variants = {
  FADE_UP: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  STAGGER: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  FLOAT: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  PARALLAX_LIGHT: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  NONE: {
    hidden: {},
    visible: {},
  },
};

export function AnimatedSection({
  children,
  preset = "FADE_UP",
  className,
  delay = 0,
}: {
  children: ReactNode;
  preset?: AnimationPreset | string;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const key = (preset as keyof typeof variants) in variants ? preset : "FADE_UP";

  if (reduced || preset === "NONE") {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      variants={variants[key as keyof typeof variants] ?? variants.FADE_UP}
    >
      {children}
    </motion.section>
  );
}
