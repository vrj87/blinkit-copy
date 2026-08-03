"use client";

import { forwardRef } from "react";
import { CATALOG_PRODUCTS } from "@/lib/product-catalog";
import { formatCurrency } from "@/lib/demo-orders";

export interface CartLineRow {
  productId: string;
  quantity: number;
}

export const BlinkitCartList = forwardRef<
  HTMLElement,
  {
    cartRows: CartLineRow[];
    cartCount: number;
    loading?: boolean;
    disabled?: boolean;
    onChangeQty: (productId: string, delta: number) => void;
    onRemoveItem: (productId: string) => void;
    onClearCart: () => void;
    className?: string;
  }
>(function BlinkitCartList(
  {
    cartRows,
    cartCount,
    loading,
    disabled,
    onChangeQty,
    onRemoveItem,
    onClearCart,
    className = "",
  },
  ref
) {
  if (cartCount === 0) return null;

  return (
    <section
      ref={ref}
      className={`blinkit-cart-panel blinkit-cart-panel-top ${className}`.trim()}
      aria-label="Shopping cart"
    >
      <div className="blinkit-cart-panel-head">
        <h3 className="blinkit-cart-panel-title">Your cart · {cartCount} items</h3>
        <button
          type="button"
          className="blinkit-cart-clear-btn"
          onClick={onClearCart}
          disabled={loading || disabled}
        >
          Clear cart
        </button>
      </div>

      <ul className="blinkit-cart-panel-list">
        {cartRows.map((row) => {
          const product = CATALOG_PRODUCTS.find((p) => p.id === row.productId);
          if (!product) return null;
          const lineTotal = product.price * row.quantity;

          return (
            <li key={row.productId} className="blinkit-cart-line">
              <span className="blinkit-cart-line-emoji" aria-hidden>{product.emoji}</span>
              <div className="blinkit-cart-line-info">
                <span className="blinkit-cart-line-name">{product.name}</span>
                <span className="blinkit-cart-line-meta">
                  {product.brand} · {formatCurrency(product.price)}
                </span>
              </div>
              <div className="blinkit-cart-line-actions">
                <div className="blinkit-cart-line-qty">
                  <button
                    type="button"
                    onClick={() => onChangeQty(row.productId, -1)}
                    disabled={disabled}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span>{row.quantity}</span>
                  <button
                    type="button"
                    onClick={() => onChangeQty(row.productId, 1)}
                    disabled={disabled}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <span className="blinkit-cart-line-total">{formatCurrency(lineTotal)}</span>
                <button
                  type="button"
                  className="blinkit-cart-line-remove"
                  onClick={() => onRemoveItem(row.productId)}
                  disabled={disabled}
                  aria-label={`Remove ${product.name}`}
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
});

export function BlinkitCartBar({
  cartTotal,
  cartCount,
  deliveryProgress,
  freeDeliveryThreshold,
  loading,
  disabled,
  onPlaceOrder,
}: {
  cartTotal: number;
  cartCount: number;
  deliveryProgress: number;
  freeDeliveryThreshold: number;
  loading?: boolean;
  disabled?: boolean;
  onPlaceOrder: () => void;
}) {
  if (cartCount === 0) return null;

  return (
    <div className="cart-bar blinkit-cart-bar">
      <div className="blinkit-cart-progress">
        <div className="blinkit-cart-progress-fill" style={{ width: `${deliveryProgress}%` }} />
        <span className="blinkit-cart-progress-label">
          {cartTotal >= freeDeliveryThreshold
            ? "You unlocked free delivery!"
            : `Add ${formatCurrency(freeDeliveryThreshold - cartTotal)} for free delivery`}
        </span>
      </div>
      <div className="cart-bar-row">
        <div className="cart-bar-info">
          <span className="cart-bar-count">{cartCount} items</span>
          <span className="cart-bar-total">{formatCurrency(cartTotal)}</span>
        </div>
        <button
          type="button"
          className="btn btn-primary cart-bar-btn blinkit-cart-btn"
          disabled={loading || disabled}
          onClick={onPlaceOrder}
        >
          {loading ? "Placing…" : "Place order"}
        </button>
      </div>
    </div>
  );
}

export function BlinkitCartPanel({
  cartRows,
  cartTotal,
  cartCount,
  deliveryProgress,
  freeDeliveryThreshold,
  loading,
  disabled,
  onChangeQty,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
}: {
  cartRows: CartLineRow[];
  cartTotal: number;
  cartCount: number;
  deliveryProgress: number;
  freeDeliveryThreshold: number;
  loading?: boolean;
  disabled?: boolean;
  onChangeQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: () => void;
}) {
  if (cartCount === 0) return null;

  return (
    <>
      <BlinkitCartList
        cartRows={cartRows}
        cartCount={cartCount}
        loading={loading}
        disabled={disabled}
        onChangeQty={onChangeQty}
        onRemoveItem={onRemoveItem}
        onClearCart={onClearCart}
      />
      <BlinkitCartBar
        cartTotal={cartTotal}
        cartCount={cartCount}
        deliveryProgress={deliveryProgress}
        freeDeliveryThreshold={freeDeliveryThreshold}
        loading={loading}
        disabled={disabled}
        onPlaceOrder={onPlaceOrder}
      />
    </>
  );
}
