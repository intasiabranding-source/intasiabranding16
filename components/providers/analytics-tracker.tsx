"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

function getSessionId() {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("dge_session");
  if (!id) {
    id = uuidv4();
    sessionStorage.setItem("dge_session", id);
  }
  return id;
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const sessionId = getSessionId();
    fetch("/api/analytics/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        path: pathname,
        referrer: document.referrer || undefined,
        eventType: "page_view",
      }),
    }).catch(() => null);
  }, [pathname]);

  return null;
}
