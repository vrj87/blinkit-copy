"use client";

import { BANK_OFFERS } from "@/lib/blinkit-storefront";

export function BlinkitBankOffers() {
  return (
    <div className="blinkit-bank-offers" aria-label="Payment offers">
      <h3 className="blinkit-section-title">Payment offers</h3>
      <div className="blinkit-bank-scroll">
        {BANK_OFFERS.map((offer) => (
          <div key={offer.id} className="blinkit-bank-card">
            <span className="blinkit-bank-emoji" aria-hidden>{offer.emoji}</span>
            <div>
              <strong>{offer.bank}</strong>
              <span>{offer.offer}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
