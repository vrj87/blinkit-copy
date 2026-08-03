/** Blinkit-style storefront content — promos, category tiles, bank offers (no external images). */

export interface BlinkitPromo {
  id: string;
  title: string;
  subtitle: string;
  cta?: string;
  gradient: string;
  emoji: string;
  tag?: string;
}

export interface BlinkitCategoryTile {
  id: string;
  label: string;
  emoji: string;
  gradient: string;
  categoryId: string;
}

export interface BlinkitBankOffer {
  id: string;
  bank: string;
  offer: string;
  emoji: string;
}

export const PROMO_BANNERS: BlinkitPromo[] = [
  {
    id: "promo-10min",
    title: "Groceries in 10 minutes",
    subtitle: "Order now · arrives before your chai boils",
    cta: "Order now",
    gradient: "linear-gradient(135deg, #f8cb46 0%, #ffe566 55%, #fff9c4 100%)",
    emoji: "⚡",
    tag: "blinkit",
  },
  {
    id: "promo-starter",
    title: "Try a new category",
    subtitle: "AI picks adjacent categories after every order",
    cta: "See For you",
    gradient: "linear-gradient(135deg, #0c831f 0%, #1a9d32 50%, #2ecc71 100%)",
    emoji: "✨",
    tag: "Smart pick",
  },
  {
    id: "promo-snacks",
    title: "Snacks & late-night",
    subtitle: "Up to 40% off on chips & beverages",
    cta: "Browse snacks",
    gradient: "linear-gradient(135deg, #ff6b35 0%, #ff9f43 100%)",
    emoji: "🍿",
    tag: "40% OFF",
  },
  {
    id: "promo-household",
    title: "Household refill",
    subtitle: "Surf, Vim, Harpic — essentials bundled",
    cta: "Shop household",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    emoji: "🧴",
    tag: "Bundle",
  },
];

export const CATEGORY_TILES: BlinkitCategoryTile[] = [
  {
    id: "tile-groc",
    label: "Groceries",
    emoji: "🥬",
    gradient: "linear-gradient(145deg, #e8f5e9, #c8e6c9)",
    categoryId: "Groceries",
  },
  {
    id: "tile-snacks",
    label: "Snacks",
    emoji: "🍿",
    gradient: "linear-gradient(145deg, #fff3e0, #ffe0b2)",
    categoryId: "Snacks & Beverages",
  },
  {
    id: "tile-house",
    label: "Household",
    emoji: "🧹",
    gradient: "linear-gradient(145deg, #e3f2fd, #bbdefb)",
    categoryId: "Household Essentials",
  },
  {
    id: "tile-dairy",
    label: "Dairy",
    emoji: "🥛",
    gradient: "linear-gradient(145deg, #fce4ec, #f8bbd9)",
    categoryId: "Groceries",
  },
  {
    id: "tile-bev",
    label: "Beverages",
    emoji: "🥤",
    gradient: "linear-gradient(145deg, #fff9c4, #fff176)",
    categoryId: "Snacks & Beverages",
  },
];

export const BANK_OFFERS: BlinkitBankOffer[] = [
  { id: "hdfc", bank: "HDFC", offer: "10% off up to ₹75", emoji: "💳" },
  { id: "sbi", bank: "SBI", offer: "Flat ₹50 on ₹499+", emoji: "🏦" },
  { id: "paytm", bank: "Paytm", offer: "Cashback on UPI", emoji: "📱" },
];

/** Scrolling brand ticker lines (Blinkit yellow strip) */
export const BRAND_MARQUEE_ITEMS: string[] = [
  "⚡ Delivery in 10 minutes",
  "blinkit — groceries & more",
  "✨ Smart Category Explorer · AI on For you",
  "🏷️ Best prices · 100% genuine",
  "🛒 Free delivery on orders above ₹199",
  "🥬 Fresh veggies · daily dairy",
  "✨ Try a new category with Groq AI",
];

export const PRODUCT_IMAGE_GRADIENTS = [
  "linear-gradient(160deg, #f5f5f5 0%, #e8f5e9 100%)",
  "linear-gradient(160deg, #fff8e1 0%, #fffde7 100%)",
  "linear-gradient(160deg, #e3f2fd 0%, #f3e5f5 100%)",
  "linear-gradient(160deg, #fce4ec 0%, #fff 100%)",
];

export function discountPercent(price: number, mrp: number): number {
  if (mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}
