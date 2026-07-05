import { Router, type IRouter } from "express";
import { desc, eq, sql } from "drizzle-orm";
import { db, complaintsTable } from "@workspace/db";

const router: IRouter = Router();

// GET /dashboard/stats
router.get("/dashboard/stats", async (_req, res): Promise<void> => {
  const all = await db.select().from(complaintsTable);

  const total = all.length;
  const pending = all.filter((c) => c.status === "pending").length;
  const inProgress = all.filter((c) => c.status === "in_progress").length;
  const resolved = all.filter((c) => c.status === "resolved").length;
  const closed = all.filter((c) => c.status === "closed").length;
  const highPriority = all.filter(
    (c) => c.priority === "high" || c.priority === "critical"
  ).length;

  // By category
  const categoryMap: Record<string, number> = {};
  for (const c of all) {
    const cat = c.aiCategory ?? c.category ?? "other";
    categoryMap[cat] = (categoryMap[cat] ?? 0) + 1;
  }
  const byCategory = Object.entries(categoryMap).map(([category, count]) => ({
    category,
    count,
  }));

  // By status
  const statusMap: Record<string, number> = {};
  for (const c of all) {
    statusMap[c.status] = (statusMap[c.status] ?? 0) + 1;
  }
  const byStatus = Object.entries(statusMap).map(([status, count]) => ({
    status,
    count,
  }));

  // By priority
  const priorityMap: Record<string, number> = {};
  for (const c of all) {
    priorityMap[c.priority] = (priorityMap[c.priority] ?? 0) + 1;
  }
  const byPriority = Object.entries(priorityMap).map(([priority, count]) => ({
    priority,
    count,
  }));

  res.json({
    total,
    pending,
    inProgress,
    resolved,
    closed,
    highPriority,
    byCategory,
    byStatus,
    byPriority,
  });
});

// GET /dashboard/recent
router.get("/dashboard/recent", async (_req, res): Promise<void> => {
  const recent = await db
    .select()
    .from(complaintsTable)
    .orderBy(desc(complaintsTable.createdAt))
    .limit(10);

  res.json(recent);
});

export default router;
