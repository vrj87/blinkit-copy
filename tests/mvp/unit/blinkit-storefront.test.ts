import { describe, expect, it } from "vitest";
import {
  discountPercent,
  PROMO_BANNERS,
  CATEGORY_TILES,
  BANK_OFFERS,
} from "../../../apps/mvp/lib/blinkit-storefront";

describe("blinkit-storefront", () => {
  it("computes discount percent from price and MRP", () => {
    expect(discountPercent(80, 100)).toBe(20);
    expect(discountPercent(100, 100)).toBe(0);
    expect(discountPercent(150, 100)).toBe(0);
  });

  it("exposes promo, category, and bank offer content", () => {
    expect(PROMO_BANNERS.length).toBeGreaterThanOrEqual(3);
    expect(CATEGORY_TILES.length).toBeGreaterThanOrEqual(4);
    expect(BANK_OFFERS.length).toBeGreaterThanOrEqual(2);
  });
});
