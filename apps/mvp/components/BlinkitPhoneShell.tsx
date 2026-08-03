"use client";

import type { ReactNode } from "react";

export type BlinkitTab = "home" | "orders" | "foryou";

export function BlinkitPhoneShell({
  children,
  activeTab,
  onTabChange,
  forYouDot = false,
  searchQuery = "",
  onSearchChange,
  onSearchFocus,
  addressTitle = "HOME",
  addressSub = "Bengaluru",
  deliveryMins = 10,
  overviewHref,
  topBanner,
  cartToast,
}: {
  children: ReactNode;
  activeTab: BlinkitTab;
  onTabChange: (tab: BlinkitTab) => void;
  forYouDot?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSearchFocus?: () => void;
  addressTitle?: string;
  addressSub?: string;
  deliveryMins?: number;
  overviewHref?: string;
  topBanner?: ReactNode;
  cartToast?: ReactNode;
}) {
  return (
    <div className="blinkit-phone">
      <header className="blinkit-phone-header">
        <div className="blinkit-phone-status">
          <span>9:41</span>
          <span className="blinkit-phone-signal">●●● ▮▮▮</span>
        </div>

        <div className="blinkit-header-brand-row">
          <span className="blinkit-phone-logo">
            blink<span>it</span>
          </span>
          {overviewHref && (
            <a href={overviewHref} className="blinkit-phone-overview-link">
              ← Overview
            </a>
          )}
        </div>

        <div className="blinkit-address-row-wrap">
          <div className="blinkit-address-block">
            <span className="blinkit-address-pin" aria-hidden>📍</span>
            <div className="blinkit-address-text">
              <div className="blinkit-address-main">
                <span className="blinkit-address-label">{addressTitle}</span>
                <span className="blinkit-address-chevron" aria-hidden>▾</span>
              </div>
              <p className="blinkit-address-sub">{addressSub}</p>
            </div>
          </div>
          <div className="blinkit-delivery-badge" aria-label={`Delivery in ${deliveryMins} minutes`}>
            <span className="blinkit-delivery-badge-time">{deliveryMins}</span>
            <span className="blinkit-delivery-badge-label">minutes</span>
          </div>
        </div>
      </header>

      <div className="blinkit-phone-search blinkit-phone-search-input-wrap">
        <span className="blinkit-phone-search-icon" aria-hidden>🔍</span>
        <input
          type="search"
          className="blinkit-phone-search-input"
          placeholder='Search "milk", "atta", "snacks"…'
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          onFocus={() => onSearchFocus?.()}
          aria-label="Search products"
        />
        {searchQuery && (
          <button
            type="button"
            className="blinkit-phone-search-clear"
            onClick={() => onSearchChange?.("")}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {topBanner && <div className="blinkit-phone-top-banner">{topBanner}</div>}

      <div className="blinkit-phone-content">{children}</div>

      {cartToast && <div className="blinkit-phone-toast-layer">{cartToast}</div>}

      <nav className="blinkit-bottom-nav" aria-label="App navigation">
        <button
          type="button"
          className={`blinkit-nav-item ${activeTab === "home" ? "blinkit-nav-active" : ""}`}
          onClick={() => onTabChange("home")}
        >
          <span className="blinkit-nav-icon">🏠</span>
          <span>Home</span>
        </button>
        <button
          type="button"
          className={`blinkit-nav-item blinkit-nav-featured ${activeTab === "foryou" ? "blinkit-nav-active" : ""}`}
          onClick={() => onTabChange("foryou")}
        >
          <span className="blinkit-nav-icon">
            ✨
            {forYouDot && <span className="blinkit-nav-dot" />}
          </span>
          <span>For you</span>
        </button>
        <button
          type="button"
          className={`blinkit-nav-item ${activeTab === "orders" ? "blinkit-nav-active" : ""}`}
          onClick={() => onTabChange("orders")}
        >
          <span className="blinkit-nav-icon">📦</span>
          <span>Orders</span>
        </button>
      </nav>
    </div>
  );
}
