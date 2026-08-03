"use client";

import { useMemo } from "react";
import { formatCurrency } from "@/lib/demo-orders";
import { discountPercent } from "@/lib/blinkit-storefront";
import { getFeaturedProductOffers } from "@/lib/product-catalog";

export function BlinkitProductOffersBanner({
  onSelect,
  disabled,
}: {
  onSelect?: (productId: string) => void;
  disabled?: boolean;
}) {
  const offers = useMemo(() => getFeaturedProductOffers(), []);
  const track = [...offers, ...offers];

  return (
    <section className="blinkit-offers-banner" aria-label="Product offers">
      <div className="blinkit-offers-banner-head">
        <h3 className="blinkit-offers-banner-title">🔥 Deals rolling in</h3>
        <span className="blinkit-offers-banner-sub">Tap to add to cart</span>
      </div>
      <div className="blinkit-offers-marquee-viewport">
        <div className="blinkit-offers-marquee-track">
          {track.map((product, index) => {
            const off = discountPercent(product.price, product.mrp);
            return (
              <button
                key={`${product.id}-${index}`}
                type="button"
                className="blinkit-offer-card"
                disabled={disabled}
                onClick={() => onSelect?.(product.id)}
              >
                <span className="blinkit-offer-card-emoji" aria-hidden>{product.emoji}</span>
                <span className="blinkit-offer-card-body">
                  <span className="blinkit-offer-card-name">{product.name}</span>
                  <span className="blinkit-offer-card-brand">{product.brand}</span>
                </span>
                <span className="blinkit-offer-card-price">{formatCurrency(product.price)}</span>
                {off > 0 && <span className="blinkit-offer-card-off">{off}% OFF</span>}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
