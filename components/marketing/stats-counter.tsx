"use client";

import { useEffect, useRef, useState } from "react";

export function StatsCounter({
  value,
  suffix,
}: {
  value: string;
  suffix?: string | null;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState("0");
  const num = parseInt(value.replace(/\D/g, ""), 10);
  const isNum = !isNaN(num) && num > 0;

  useEffect(() => {
    if (!isNum) {
      setDisplay(value);
      return;
    }
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplay(Math.floor(progress * num).toString());
      if (progress < 1) requestAnimationFrame(step);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) requestAnimationFrame(step);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, isNum, num]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
