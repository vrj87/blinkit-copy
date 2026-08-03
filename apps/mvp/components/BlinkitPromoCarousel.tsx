"use client";

import { PROMO_BANNERS } from "@/lib/blinkit-storefront";

export function BlinkitPromoCarousel({
  onPromoClick,
}: {
  onPromoClick?: (promoId: string) => void;
}) {
  return (
    <div className="blinkit-promo-scroll" aria-label="Promotional offers">
      {PROMO_BANNERS.map((promo) => (
        <button
          key={promo.id}
          type="button"
          className="blinkit-promo-card"
          style={{ background: promo.gradient }}
          onClick={() => onPromoClick?.(promo.id)}
        >
          {promo.tag && <span className="blinkit-promo-tag">{promo.tag}</span>}
          <span className="blinkit-promo-emoji" aria-hidden>{promo.emoji}</span>
          <div className="blinkit-promo-text">
            <strong>{promo.title}</strong>
            <span>{promo.subtitle}</span>
            {promo.cta && <span className="blinkit-promo-cta">{promo.cta} →</span>}
          </div>
        </button>
      ))}
    </div>
  );
}
