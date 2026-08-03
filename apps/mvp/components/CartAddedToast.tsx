"use client";

export function CartAddedToast({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div className="cart-added-toast" role="status" aria-live="polite">
      <span className="cart-added-toast-icon" aria-hidden>✓</span>
      <span className="cart-added-toast-text">{message}</span>
    </div>
  );
}
