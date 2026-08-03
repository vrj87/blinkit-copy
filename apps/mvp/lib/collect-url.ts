/** Resolve public app URL (Netlify, Vercel, or explicit env). */
function resolveAppUrl(): string | null {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.URL,
    process.env.DEPLOY_PRIME_URL,
    process.env.DEPLOY_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ];

  for (const raw of candidates) {
    if (!raw) continue;
    const url = raw.startsWith("http") ? raw : `https://${raw}`;
    if (!url.includes("localhost")) {
      return url.replace(/\/$/, "");
    }
  }
  return null;
}

function devMvpBase(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

/** Collect / discovery workflow URL — embedded MVP collect or production discovery dashboard */
export function collectAppUrl(): string {
  const localCollect = process.env.NEXT_PUBLIC_COLLECT_URL?.replace(/\/$/, "");
  const app = resolveAppUrl();

  if (app) {
    return `${app}/dashboard/discovery`;
  }

  // Local dev: embed collect UI on the MVP app (no separate :3001 server required)
  if (process.env.NODE_ENV === "development") {
    if (localCollect?.includes("localhost:3001")) {
      return localCollect;
    }
    return `${devMvpBase()}/collect`;
  }

  return localCollect ?? "http://localhost:3001";
}

/** True when the embedded MVP collect page or legacy :3001 app is the target */
export function isLocalCollectHost(url: string): boolean {
  if (process.env.NODE_ENV !== "development") return false;
  return url.includes("/collect") || url.includes("localhost:3001");
}

/** Whether to render an inline iframe for the collect / discovery workflow */
export function shouldEmbedCollectFrame(url: string): boolean {
  if (url.includes("/collect") || url.includes("/dashboard/discovery")) return true;
  return isLocalCollectHost(url);
}

/** Same-origin path for iframe src (avoids mixed-content / localhost on production) */
export function collectIframeSrc(url: string): string {
  if (url.includes("/dashboard/discovery")) {
    return "/dashboard/discovery";
  }
  if (url.includes("/collect")) {
    return "/collect";
  }
  return url;
}
