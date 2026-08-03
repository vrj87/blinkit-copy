"use client";

import { BRAND_MARQUEE_ITEMS } from "@/lib/blinkit-storefront";

export function BlinkitBrandMarquee() {
  const items = [...BRAND_MARQUEE_ITEMS, ...BRAND_MARQUEE_ITEMS];

  return (
    <div className="blinkit-brand-marquee" aria-label="Blinkit promotions">
      <div className="blinkit-brand-marquee-track">
        {items.map((text, index) => (
          <span key={`${text}-${index}`} className="blinkit-brand-marquee-item">
            <span className="blinkit-brand-marquee-logo">blink<span>it</span></span>
            <span className="blinkit-brand-marquee-dot" aria-hidden>·</span>
            <span>{text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
