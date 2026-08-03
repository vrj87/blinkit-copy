"use client";

import { useCallback, useState } from "react";
import { DemoUserClient, type NudgeRow } from "@/components/DemoUserClient";
import {
  loadUserDemoState,
  saveUserDemoState,
  type UserDemoState,
} from "@/lib/demo-order-cache";
import { normalizeOrderRow } from "@/lib/order-row";
import type { OrderRow } from "@/lib/order-row";

export interface DemoUserData {
  id: string;
  name: string;
  orderCount: number;
  categoriesPurchased: string;
  personaLabel: string;
  addressTitle: string;
  addressSub: string;
  deliveryMins?: number;
  orders: OrderRow[];
  nudges: NudgeRow[];
}

function buildInitialStats(users: DemoUserData[]): Record<string, UserDemoState> {
  return Object.fromEntries(
    users.map((user) => [
      user.id,
      loadUserDemoState(
        user.id,
        user.orders.map((o) => normalizeOrderRow(o)),
        user.orderCount
      ),
    ])
  );
}

export function DemoUserSwitcher({ users }: { users: DemoUserData[] }) {
  const [activeId, setActiveId] = useState(users[0]?.id ?? "");
  const [userStats, setUserStats] = useState<Record<string, UserDemoState>>(() =>
    buildInitialStats(users)
  );

  const handleStatsChange = useCallback((userId: string, stats: UserDemoState) => {
    setUserStats((prev) => {
      const orderCount = Math.max(stats.orderCount, stats.orders.length);
      const next = { ...stats, orderCount };
      saveUserDemoState(userId, next);
      return { ...prev, [userId]: next };
    });
  }, []);

  const activeBase = users.find((u) => u.id === activeId) ?? users[0];
  if (!activeBase) return null;

  const activeStats = userStats[activeBase.id] ?? loadUserDemoState(
    activeBase.id,
    activeBase.orders.map((o) => normalizeOrderRow(o)),
    activeBase.orderCount
  );

  const activeUser: DemoUserData = {
    ...activeBase,
    orders: activeStats.orders,
    orderCount: activeStats.orderCount,
  };

  return (
    <div className="demo-user-switcher">
      <div className="demo-user-pills" role="tablist" aria-label="Demo users">
        {users.map((user) => {
          const stats = userStats[user.id];
          const displayCount =
            stats?.orderCount ??
            Math.max(user.orderCount, stats?.orders.length ?? user.orders.length);
          return (
            <button
              key={user.id}
              type="button"
              role="tab"
              aria-selected={user.id === activeId}
              className={`demo-user-pill ${user.id === activeId ? "demo-user-pill-active" : ""}`}
              onClick={() => setActiveId(user.id)}
            >
              <span className="demo-user-pill-name">{user.name.split(" ")[0]}</span>
              <span className="demo-user-pill-meta">{displayCount} orders</span>
            </button>
          );
        })}
      </div>
      <DemoUserClient
        key={activeBase.id}
        embedded
        user={activeUser}
        onStatsChange={(stats) => handleStatsChange(activeBase.id, stats)}
      />
    </div>
  );
}
