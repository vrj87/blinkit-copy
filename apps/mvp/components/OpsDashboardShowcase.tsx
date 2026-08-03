import Link from "next/link";
import { parseJsonArray } from "@/lib/segment";

export interface OpsUserRow {
  id: string;
  name: string;
  orderCount: number;
  categoriesPurchased: string;
}

export interface OpsNudgeRow {
  id: string;
  status: string;
  suggestedCategory: string;
  copy: string;
  user: { name: string };
}

export function OpsDashboardShowcase({
  users,
  nudges,
  orderCount,
  linkMode = "demo",
}: {
  users: OpsUserRow[];
  nudges: OpsNudgeRow[];
  orderCount: number;
  linkMode?: "demo" | "mvp";
}) {
  const accepted = nudges.filter((n) => n.status === "accepted").length;
  const pending = nudges.filter((n) => n.status === "pending").length;

  return (
    <>
      <div className="grid grid-3">
        <div className="card stat-card">
          <div className="stat-value">{users.length}</div>
          <div className="stat-label">Users</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{orderCount}</div>
          <div className="stat-label">Orders</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{nudges.length}</div>
          <div className="stat-label">Nudges</div>
        </div>
      </div>

      <div className="grid grid-3 ops-stats-row">
        <div className="card stat-card">
          <div className="stat-value">{pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{accepted}</div>
          <div className="stat-label">Accepted</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">
            {nudges.length ? Math.round((accepted / nudges.length) * 100) : 0}%
          </div>
          <div className="stat-label">Accept rate</div>
        </div>
      </div>

      <h3 className="ops-section-heading">All demo users</h3>
      {users.map((user) => (
        <div key={user.id} className="card">
          <strong>{user.name}</strong>
          <span className="ops-user-meta">
            {user.orderCount} orders · {parseJsonArray<string>(user.categoriesPurchased).join(", ")}
          </span>
          {linkMode === "mvp" ? (
            <a href="/mvp" target="_blank" rel="noopener noreferrer" className="ops-user-link">
              Test in MVP →
            </a>
          ) : (
            <Link href={`/demo/user/${user.id}`} className="ops-user-link">
              Open demo →
            </Link>
          )}
        </div>
      ))}

      <h3 className="ops-section-heading">Recent nudges</h3>
      {nudges.map((nudge) => (
        <div key={nudge.id} className="card">
          <span className={`badge badge-${nudge.status}`}>{nudge.status}</span>
          <strong className="ops-nudge-user">{nudge.user.name}</strong>
          <span className="ops-nudge-category"> → {nudge.suggestedCategory}</span>
          <p className="ops-nudge-copy">{nudge.copy}</p>
        </div>
      ))}
    </>
  );
}
