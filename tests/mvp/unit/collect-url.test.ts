import { afterEach, describe, expect, it, vi } from "vitest";
import {
  collectAppUrl,
  collectIframeSrc,
  isLocalCollectHost,
  shouldEmbedCollectFrame,
} from "../../../apps/mvp/lib/collect-url";

describe("collect-url", () => {
  const env = process.env;

  afterEach(() => {
    process.env = { ...env };
    vi.unstubAllEnvs();
  });

  it("uses embedded MVP collect page in development by default", () => {
    vi.stubEnv("NODE_ENV", "development");
    delete process.env.NEXT_PUBLIC_COLLECT_URL;
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    const url = collectAppUrl();
    expect(url).toBe("http://localhost:3000/collect");
    expect(isLocalCollectHost(url)).toBe(true);
    expect(shouldEmbedCollectFrame(url)).toBe(true);
    expect(collectIframeSrc(url)).toBe("/collect");
  });

  it("honors explicit :3001 collect app when configured", () => {
    vi.stubEnv("NODE_ENV", "development");
    process.env.NEXT_PUBLIC_COLLECT_URL = "http://localhost:3001";
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    expect(collectAppUrl()).toBe("http://localhost:3001");
    expect(isLocalCollectHost(collectAppUrl())).toBe(true);
  });

  it("uses discovery dashboard in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    process.env.NEXT_PUBLIC_COLLECT_URL = "http://localhost:3001";
    process.env.NEXT_PUBLIC_APP_URL = "https://hilarious-biscotti-30273b.netlify.app";
    const url = collectAppUrl();
    expect(url).toBe("https://hilarious-biscotti-30273b.netlify.app/dashboard/discovery");
    expect(isLocalCollectHost(url)).toBe(false);
    expect(shouldEmbedCollectFrame(url)).toBe(true);
    expect(collectIframeSrc(url)).toBe("/dashboard/discovery");
  });

  it("resolves Netlify URL when NEXT_PUBLIC_APP_URL is unset", () => {
    vi.stubEnv("NODE_ENV", "production");
    delete process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.NEXT_PUBLIC_COLLECT_URL;
    process.env.URL = "https://hilarious-biscotti-30273b.netlify.app";
    expect(collectAppUrl()).toContain("/dashboard/discovery");
  });
});
