import { normalizeOrderRow, type OrderRow } from "./order-row";

const ORDERS_KEY = "blinkit-demo-orders:";
const COUNT_KEY = "blinkit-demo-count:";

export interface UserDemoState {
  orders: OrderRow[];
  orderCount: number;
}

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadCachedOrders(userId: string): OrderRow[] {
  const store = getStorage();
  if (!store) return [];
  try {
    const raw = store.getItem(`${ORDERS_KEY}${userId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    return parsed.map(normalizeOrderRow);
  } catch {
    return [];
  }
}

export function loadCachedOrderCount(userId: string): number | null {
  const store = getStorage();
  if (!store) return null;
  try {
    const raw = store.getItem(`${COUNT_KEY}${userId}`);
    if (raw == null) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function saveCachedOrders(userId: string, orders: OrderRow[]): void {
  const store = getStorage();
  if (!store) return;
  try {
    store.setItem(`${ORDERS_KEY}${userId}`, JSON.stringify(orders));
  } catch {
    /* quota / private mode */
  }
}

export function saveCachedOrderCount(userId: string, orderCount: number): void {
  const store = getStorage();
  if (!store) return;
  try {
    store.setItem(`${COUNT_KEY}${userId}`, String(orderCount));
  } catch {
    /* quota / private mode */
  }
}

/** Merge server + local demo orders (newest first, dedupe by id) */
export function mergeOrders(server: OrderRow[], cached: OrderRow[]): OrderRow[] {
  const byId = new Map<string, OrderRow>();
  for (const raw of [...server, ...cached]) {
    const row = normalizeOrderRow(raw);
    byId.set(row.id, row);
  }
  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/** Build display state for a demo user (server seed + local persistence) */
export function loadUserDemoState(
  userId: string,
  serverOrders: OrderRow[],
  serverOrderCount: number
): UserDemoState {
  const normalized = serverOrders.map((o) => normalizeOrderRow(o));
  const merged = mergeOrders(normalized, loadCachedOrders(userId));
  // DB orderCount is authoritative; merged.length covers offline-only local orders
  const orderCount = Math.max(serverOrderCount, merged.length);
  return { orders: merged, orderCount };
}

export function saveUserDemoState(userId: string, state: UserDemoState): void {
  saveCachedOrders(userId, state.orders);
  saveCachedOrderCount(userId, state.orderCount);
}

export function withNewOrder(
  userId: string,
  current: UserDemoState,
  order: OrderRow
): UserDemoState {
  const normalized = normalizeOrderRow(order);
  const orders = [normalized, ...current.orders.filter((o) => o.id !== normalized.id)];
  const orderCount = Math.max(current.orderCount + 1, orders.length);
  const next = { orders, orderCount };
  saveUserDemoState(userId, next);
  return next;
}
