/** Realistic weekly grocery baskets for demo reorder flow */

export interface DemoBasket {
  label: string;
  items: string[];
  categories: string[];
  totalAmount: number;
}

export const WEEKLY_GROCERY_BASKETS: DemoBasket[] = [
  {
    label: "Weekly staples",
    items: ["Amul Taaza Milk 1L", "Britannia Bread", "Tomatoes 500g", "Onions 1kg", "Basmati Rice 5kg"],
    categories: ["Groceries"],
    totalAmount: 487,
  },
  {
    label: "Dal & dairy refill",
    items: ["Toor Dal 1kg", "Milk 1L", "Curd 400g", "Bread", "Bananas 6pc"],
    categories: ["Groceries"],
    totalAmount: 312,
  },
  {
    label: "Same list again",
    items: ["Milk 1L", "Eggs 12pc", "Atta 5kg", "Potatoes 1kg", "Cooking Oil 1L"],
    categories: ["Groceries"],
    totalAmount: 528,
  },
];

export function nextBasket(orderIndex: number): DemoBasket {
  return WEEKLY_GROCERY_BASKETS[orderIndex % WEEKLY_GROCERY_BASKETS.length];
}

export function formatOrderDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfOrderDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfOrderDay.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays <= 10) {
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }

  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function formatCurrency(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

export function shortOrderId(id: string): string {
  return id.slice(-6).toUpperCase();
}
