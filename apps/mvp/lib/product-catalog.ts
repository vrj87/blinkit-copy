export interface CatalogProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  mrp: number;
  emoji: string;
  unit: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  deliveryMins?: number;
}

export const HOME_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "Groceries", label: "Groceries" },
  { id: "Snacks & Beverages", label: "Snacks" },
  { id: "Household Essentials", label: "Household" },
] as const;

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: "groc-milk",
    name: "Taaza Toned Milk",
    brand: "Amul",
    category: "Groceries",
    price: 56,
    mrp: 60,
    emoji: "🥛",
    unit: "1 L",
    rating: 4.6,
    reviewCount: 12400,
    badge: "Bestseller",
    deliveryMins: 10,
  },
  {
    id: "groc-bread",
    name: "Milk Bread",
    brand: "Britannia",
    category: "Groceries",
    price: 45,
    mrp: 50,
    emoji: "🍞",
    unit: "400 g",
    rating: 4.5,
    reviewCount: 8900,
    deliveryMins: 10,
  },
  {
    id: "groc-atta",
    name: "Whole Wheat Atta",
    brand: "Aashirvaad",
    category: "Groceries",
    price: 285,
    mrp: 310,
    emoji: "🌾",
    unit: "5 kg",
    rating: 4.7,
    reviewCount: 15200,
    badge: "Bestseller",
    deliveryMins: 12,
  },
  {
    id: "groc-rice",
    name: "Basmati Rice",
    brand: "India Gate",
    category: "Groceries",
    price: 520,
    mrp: 580,
    emoji: "🍚",
    unit: "5 kg",
    rating: 4.6,
    reviewCount: 6700,
    deliveryMins: 12,
  },
  {
    id: "groc-dal",
    name: "Toor Dal",
    brand: "Tata Sampann",
    category: "Groceries",
    price: 145,
    mrp: 165,
    emoji: "🫘",
    unit: "1 kg",
    rating: 4.4,
    reviewCount: 4200,
    deliveryMins: 10,
  },
  {
    id: "groc-eggs",
    name: "Farm Eggs",
    brand: "Licious",
    category: "Groceries",
    price: 89,
    mrp: 99,
    emoji: "🥚",
    unit: "12 pcs",
    rating: 4.5,
    reviewCount: 5600,
    deliveryMins: 10,
  },
  {
    id: "groc-onion",
    name: "Onion",
    brand: "Fresho",
    category: "Groceries",
    price: 38,
    mrp: 45,
    emoji: "🧅",
    unit: "1 kg",
    rating: 4.2,
    reviewCount: 3100,
    deliveryMins: 10,
  },
  {
    id: "groc-tomato",
    name: "Tomato",
    brand: "Fresho",
    category: "Groceries",
    price: 32,
    mrp: 40,
    emoji: "🍅",
    unit: "500 g",
    rating: 4.1,
    reviewCount: 2800,
    deliveryMins: 10,
  },
  {
    id: "groc-curd",
    name: "Cup Curd",
    brand: "Mother Dairy",
    category: "Groceries",
    price: 28,
    mrp: 32,
    emoji: "🥣",
    unit: "400 g",
    rating: 4.5,
    reviewCount: 7200,
    deliveryMins: 10,
  },
  {
    id: "groc-banana",
    name: "Banana Robusta",
    brand: "Fresho",
    category: "Groceries",
    price: 49,
    mrp: 55,
    emoji: "🍌",
    unit: "6 pcs",
    rating: 4.3,
    reviewCount: 4500,
    deliveryMins: 10,
  },
  {
    id: "snack-chips",
    name: "Classic Salted Chips",
    brand: "Lay's",
    category: "Snacks & Beverages",
    price: 20,
    mrp: 25,
    emoji: "🍟",
    unit: "52 g",
    rating: 4.4,
    reviewCount: 9800,
    deliveryMins: 10,
  },
  {
    id: "snack-biscuit",
    name: "Good Day Cookies",
    brand: "Britannia",
    category: "Snacks & Beverages",
    price: 30,
    mrp: 35,
    emoji: "🍪",
    unit: "200 g",
    rating: 4.6,
    reviewCount: 11200,
    badge: "Bestseller",
    deliveryMins: 10,
  },
  {
    id: "snack-coffee",
    name: "Cold Coffee",
    brand: "Bru",
    category: "Snacks & Beverages",
    price: 45,
    mrp: 55,
    emoji: "☕",
    unit: "280 ml",
    rating: 4.3,
    reviewCount: 3400,
    deliveryMins: 10,
  },
  {
    id: "snack-maggi",
    name: "Masala Noodles",
    brand: "Maggi",
    category: "Snacks & Beverages",
    price: 14,
    mrp: 16,
    emoji: "🍜",
    unit: "70 g",
    rating: 4.7,
    reviewCount: 22000,
    badge: "Bestseller",
    deliveryMins: 10,
  },
  {
    id: "snack-juice",
    name: "Mixed Fruit Juice",
    brand: "Real",
    category: "Snacks & Beverages",
    price: 110,
    mrp: 130,
    emoji: "🧃",
    unit: "1 L",
    rating: 4.4,
    reviewCount: 5100,
    deliveryMins: 11,
  },
  {
    id: "hh-detergent",
    name: "Matic Front Load",
    brand: "Surf Excel",
    category: "Household Essentials",
    price: 289,
    mrp: 320,
    emoji: "🧺",
    unit: "2 kg",
    rating: 4.5,
    reviewCount: 6400,
    deliveryMins: 12,
  },
  {
    id: "hh-dishwash",
    name: "Dishwash Gel",
    brand: "Vim",
    category: "Household Essentials",
    price: 99,
    mrp: 115,
    emoji: "🫧",
    unit: "500 ml",
    rating: 4.4,
    reviewCount: 3800,
    deliveryMins: 11,
  },
  {
    id: "hh-tissue",
    name: "Facial Tissues",
    brand: "Kleenex",
    category: "Household Essentials",
    price: 85,
    mrp: 99,
    emoji: "🧻",
    unit: "100 pulls",
    rating: 4.3,
    reviewCount: 2100,
    deliveryMins: 11,
  },
  {
    id: "hh-cleaner",
    name: "Floor Cleaner",
    brand: "Lizol",
    category: "Household Essentials",
    price: 175,
    mrp: 199,
    emoji: "🧹",
    unit: "1 L",
    rating: 4.5,
    reviewCount: 4700,
    deliveryMins: 12,
  },
];

const productMap = new Map(CATALOG_PRODUCTS.map((p) => [p.id, p]));

export function getProduct(id: string): CatalogProduct | undefined {
  return productMap.get(id);
}

export function getProductsByCategory(categoryId: string): CatalogProduct[] {
  if (categoryId === "all") return CATALOG_PRODUCTS;
  return CATALOG_PRODUCTS.filter((p) => p.category === categoryId);
}

export function searchProducts(query: string, categoryId = "all"): CatalogProduct[] {
  const q = query.trim().toLowerCase();
  const base = getProductsByCategory(categoryId);
  if (!q) return base;

  return base.filter((p) => {
    const haystack = `${p.name} ${p.brand} ${p.category} ${p.unit}`.toLowerCase();
    return haystack.includes(q) || q.split(/\s+/).every((term) => haystack.includes(term));
  });
}

export interface OrderLineItem {
  productId: string;
  name: string;
  brand: string;
  category: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export function resolveCartLineItems(
  cart: { productId: string; quantity: number }[]
): { lineItems: OrderLineItem[]; items: string[]; categories: string[]; totalAmount: number } {
  const lineItems: OrderLineItem[] = [];
  const categories = new Set<string>();

  for (const row of cart) {
    const product = getProduct(row.productId);
    if (!product || row.quantity < 1) continue;
    categories.add(product.category);
    lineItems.push({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      quantity: row.quantity,
      unitPrice: product.price,
      lineTotal: product.price * row.quantity,
    });
  }

  const itemLabels = lineItems.map((l) => {
    const unit = productMap.get(l.productId)?.unit ?? "";
    return l.quantity > 1
      ? `${l.brand} ${l.name} ×${l.quantity}`
      : `${l.brand} ${l.name} (${unit})`;
  });

  const totalAmount = lineItems.reduce((sum, l) => sum + l.lineTotal, 0);

  return {
    lineItems,
    items: itemLabels,
    categories: [...categories],
    totalAmount,
  };
}

/** Top discounted products for the moving offers banner */
export function getFeaturedProductOffers(limit = 14): CatalogProduct[] {
  return [...CATALOG_PRODUCTS]
    .filter((p) => p.mrp > p.price)
    .sort((a, b) => {
      const offA = (a.mrp - a.price) / a.mrp;
      const offB = (b.mrp - b.price) / b.mrp;
      return offB - offA;
    })
    .slice(0, limit);
}
