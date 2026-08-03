import { describe, expect, it } from "vitest";
import { formatOrderDate } from "../../../apps/mvp/lib/demo-orders";
import { daysAgo } from "../../../apps/mvp/lib/demo-users";

describe("formatOrderDate", () => {
  it("labels today and yesterday", () => {
    expect(formatOrderDate(daysAgo(0).toISOString())).toBe("Today");
    expect(formatOrderDate(daysAgo(1).toISOString())).toBe("Yesterday");
  });

  it("shows short dates within the last 10 days", () => {
    const label = formatOrderDate(daysAgo(5).toISOString());
    expect(label).not.toBe("Today");
    expect(label).not.toBe("Yesterday");
    expect(label).toMatch(/\d{1,2} \w{3}/);
  });
});
