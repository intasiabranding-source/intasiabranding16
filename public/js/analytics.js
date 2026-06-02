function getSessionId() {
  let id = sessionStorage.getItem("dge_session");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("dge_session", id);
  }
  return id;
}

function loadGa(measurementId) {
  if (!measurementId || document.getElementById("ga-script")) return;
  const s = document.createElement("script");
  s.id = "ga-script";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", measurementId);
}

export function trackPageView(path) {
  if (path.startsWith("/admin")) return;
  const sessionId = getSessionId();
  fetch("/api/analytics/collect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      path,
      referrer: document.referrer || undefined,
      eventType: "page_view",
    }),
  }).catch(() => null);
}

export function initAnalytics(gaMeasurementId) {
  loadGa(gaMeasurementId);
  trackPageView(window.location.pathname);
}
