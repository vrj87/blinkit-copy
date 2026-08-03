"use client";

import { CATEGORY_TILES } from "@/lib/blinkit-storefront";

export function BlinkitCategoryTiles({
  activeCategory,
  onSelect,
}: {
  activeCategory: string;
  onSelect: (categoryId: string) => void;
}) {
  return (
    <div className="blinkit-tiles-section">
      <h3 className="blinkit-section-title">Shop by category</h3>
      <div className="blinkit-tiles-grid">
        {CATEGORY_TILES.map((tile) => {
          const isActive = activeCategory === tile.categoryId;
          return (
            <button
              key={tile.id}
              type="button"
              className={`blinkit-tile ${isActive ? "blinkit-tile-active" : ""}`}
              onClick={() => onSelect(tile.categoryId)}
            >
              <span
                className="blinkit-tile-icon"
                style={{ background: tile.gradient }}
                aria-hidden
              >
                {tile.emoji}
              </span>
              <span className="blinkit-tile-label">{tile.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
