"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BlinkitBankOffers } from "@/components/BlinkitBankOffers";
import { BlinkitBrandMarquee } from "@/components/BlinkitBrandMarquee";
import { BlinkitCartBar, BlinkitCartList } from "@/components/BlinkitCartPanel";
import { BlinkitCategoryTiles } from "@/components/BlinkitCategoryTiles";
import { BlinkitPromoCarousel } from "@/components/BlinkitPromoCarousel";
import {
  CATALOG_PRODUCTS,
  searchProducts,
  type CatalogProduct,
} from "@/lib/product-catalog";
import { discountPercent, PRODUCT_IMAGE_GRADIENTS } from "@/lib/blinkit-storefront";
import { formatCurrency } from "@/lib/demo-orders";

interface CartRow {
  productId: string;
  quantity: number;
}

export function BlinkitHomeCatalog({
  userName,
  searchQuery = "",
  onPlaceOrder,
  onOpenForYou,
  loading,
  disabled,
  pendingCartProductId,
  onPendingCartConsumed,
  onProductAdded,
}: {
  userName: string;
  searchQuery?: string;
  onPlaceOrder: (lineItems: CartRow[]) => Promise<boolean> | boolean;
  onOpenForYou?: () => void;
  loading?: boolean;
  disabled?: boolean;
  pendingCartProductId?: string | null;
  onPendingCartConsumed?: () => void;
  onProductAdded?: (product: CatalogProduct) => void;
}) {
  const firstName = userName.split(" ")[0];
  const [category, setCategory] = useState<string>("all");
  const cartSectionRef = useRef<HTMLElement>(null);

  const [cart, setCart] = useState<Record<string, number>>({});

  const products = useMemo(
    () => searchProducts(searchQuery, category),
    [searchQuery, category]
  );
  const isSearching = searchQuery.trim().length > 0;

  const cartRows: CartRow[] = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([productId, quantity]) => ({ productId, quantity }));

  const cartTotal = cartRows.reduce((sum, row) => {
    const p = CATALOG_PRODUCTS.find((x) => x.id === row.productId);
    return sum + (p?.price ?? 0) * row.quantity;
  }, 0);

  const cartCount = cartRows.reduce((sum, r) => sum + r.quantity, 0);
  const freeDeliveryThreshold = 199;
  const deliveryProgress = Math.min(100, Math.round((cartTotal / freeDeliveryThreshold) * 100));

  function addToCart(product: CatalogProduct) {
    setCart((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] ?? 0) + 1,
    }));
    onProductAdded?.(product);
  }

  useEffect(() => {
    if (!pendingCartProductId) return;
    const product = CATALOG_PRODUCTS.find((p) => p.id === pendingCartProductId);
    if (product && !disabled) addToCart(product);
    onPendingCartConsumed?.();
  }, [pendingCartProductId, disabled, onPendingCartConsumed]);

  function changeQty(productId: string, delta: number) {
    setCart((prev) => {
      const next = (prev[productId] ?? 0) + delta;
      if (next <= 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: next };
    });
    if (delta > 0) {
      const product = CATALOG_PRODUCTS.find((p) => p.id === productId);
      if (product) onProductAdded?.(product);
    }
  }

  function clearCart() {
    setCart({});
  }

  function removeFromCart(productId: string) {
    setCart((prev) => {
      const { [productId]: _, ...rest } = prev;
      return rest;
    });
  }

  async function handlePlaceOrder() {
    if (cartCount === 0 || loading || disabled) return;
    const ok = await onPlaceOrder(cartRows);
    if (ok) clearCart();
  }

  function handlePromoClick(promoId: string) {
    if (promoId === "promo-starter") {
      onOpenForYou?.();
      return;
    }
    if (promoId === "promo-snacks") {
      setCategory("Snacks & Beverages");
      return;
    }
    if (promoId === "promo-household") {
      setCategory("Household Essentials");
    }
  }

  function handleCategoryTile(categoryId: string) {
    setCategory(categoryId);
  }

  function scrollToCart() {
    cartSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="blinkit-home">
      {!isSearching && <BlinkitBrandMarquee />}

      {!isSearching && (
        <div className="blinkit-home-hero">
          <p className="user-greeting">Hi, {firstName} 👋</p>
          <p className="blinkit-home-sub">What would you like to order today?</p>
        </div>
      )}

      {cartCount > 0 && (
        <button
          type="button"
          className="blinkit-cart-home-chip"
          onClick={scrollToCart}
          aria-label={`View cart, ${cartCount} items, ${formatCurrency(cartTotal)}`}
        >
          <span className="blinkit-cart-home-chip-icon" aria-hidden>🛒</span>
          <span className="blinkit-cart-home-chip-text">
            <span className="blinkit-cart-home-chip-label">View cart</span>
            <span className="blinkit-cart-home-chip-meta">
              {cartCount} items · {formatCurrency(cartTotal)}
            </span>
          </span>
          <span className="blinkit-cart-home-chip-arrow" aria-hidden>→</span>
        </button>
      )}

      {cartCount > 0 && (
        <BlinkitCartList
          ref={cartSectionRef}
          cartRows={cartRows}
          cartCount={cartCount}
          loading={loading}
          disabled={disabled}
          onChangeQty={changeQty}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
        />
      )}

      {isSearching && (
        <p className="user-greeting blinkit-home-greeting">Hi, {firstName} 👋</p>
      )}

      {!isSearching && (
        <>
          <BlinkitPromoCarousel onPromoClick={handlePromoClick} />
          <BlinkitCategoryTiles
            activeCategory={category === "all" ? "" : category}
            onSelect={handleCategoryTile}
          />
          <BlinkitBankOffers />
        </>
      )}

      {isSearching && (
        <p className="search-results-label">
          {products.length} result{products.length === 1 ? "" : "s"} for &quot;{searchQuery.trim()}&quot;
        </p>
      )}

      {!isSearching && (
        <h3 className="blinkit-section-title blinkit-products-heading">Bestsellers near you</h3>
      )}

      {products.length === 0 ? (
        <div className="card empty-state search-empty-state">
          <p>No products found.</p>
          <p style={{ fontSize: "0.85rem", marginTop: "0.35rem" }}>
            Try &quot;milk&quot;, &quot;bread&quot;, &quot;chips&quot;, or &quot;detol&quot;
          </p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product, index) => {
            const qty = cart[product.id] ?? 0;
            const off = discountPercent(product.price, product.mrp);
            const imageBg = PRODUCT_IMAGE_GRADIENTS[index % PRODUCT_IMAGE_GRADIENTS.length];

            return (
              <article key={product.id} className="product-card product-card-blinkit">
                <div className="product-image-well" style={{ background: imageBg }}>
                  <span className="product-emoji">{product.emoji}</span>
                  {off > 0 && <span className="product-discount-tag">{off}% OFF</span>}
                  {product.badge && <span className="product-badge">{product.badge}</span>}
                </div>
                <p className="product-brand">{product.brand}</p>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-unit">{product.unit}</p>
                <div className="product-meta-row">
                  <span className="product-rating">★ {product.rating}</span>
                  {product.deliveryMins && (
                    <span className="product-delivery-mins">{product.deliveryMins} min</span>
                  )}
                </div>
                <div className="product-price-row">
                  <span className="product-price">{formatCurrency(product.price)}</span>
                  <span className="product-mrp">{formatCurrency(product.mrp)}</span>
                </div>
                {qty === 0 ? (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm product-add-btn"
                    onClick={() => addToCart(product)}
                    disabled={disabled}
                  >
                    Add to cart
                  </button>
                ) : (
                  <div className="product-qty-control">
                    <button type="button" onClick={() => changeQty(product.id, -1)} aria-label="Decrease">
                      −
                    </button>
                    <span>{qty}</span>
                    <button type="button" onClick={() => changeQty(product.id, 1)} aria-label="Increase">
                      +
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {cartCount > 0 && (
        <div className="blinkit-cart-dock">
          <BlinkitCartBar
            cartTotal={cartTotal}
            cartCount={cartCount}
            deliveryProgress={deliveryProgress}
            freeDeliveryThreshold={freeDeliveryThreshold}
            loading={loading}
            disabled={disabled}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      )}

      <div className="blinkit-trust-strip">
        <span>🛡️ 100% genuine</span>
        <span>·</span>
        <span>✨ AI picks on For you</span>
      </div>
    </div>
  );
}
