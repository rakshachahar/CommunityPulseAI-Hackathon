import { Router, type IRouter } from "express";
import { and, desc, asc, eq, ilike, or } from "drizzle-orm";
import { db, complaintsTable } from "@workspace/db";
import {
  ListComplaintsQueryParams,
  CreateComplaintBody,
  GetComplaintParams,
  UpdateComplaintParams,
  UpdateComplaintBody,
  DeleteComplaintParams,
  AnalyzeComplaintBody,
} from "@workspace/api-zod";
import { analyzeWithGemini } from "../../lib/gemini.js";

const router: IRouter = Router();

// GET /complaints
router.get("/complaints", async (req, res): Promise<void> => {
  const parsed = ListComplaintsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { status, category, priority, search, sort, order } = parsed.data;

  const conditions = [];
  if (status) conditions.push(eq(complaintsTable.status, status));
  if (category) conditions.push(eq(complaintsTable.category, category));
  if (priority) conditions.push(eq(complaintsTable.priority, priority));
  if (search) {
    conditions.push(
      or(
        ilike(complaintsTable.description, `%${search}%`),
        ilike(complaintsTable.location, `%${search}%`),
        ilike(complaintsTable.aiTitle, `%${search}%`)
      )
    );
  }

  const sortDir = order === "asc" ? asc : desc;
  const sortCol =
    sort === "priority"
      ? complaintsTable.priority
      : sort === "status"
        ? complaintsTable.status
        : sort === "location"
          ? complaintsTable.location
          : complaintsTable.createdAt;

  const complaints = await db
    .select()
    .from(complaintsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(sortDir(sortCol));

  res.json(complaints);
});

// POST /complaints/analyze — must come before /complaints/:id
router.post("/complaints/analyze", async (req, res): Promise<void> => {
  const parsed = AnalyzeComplaintBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { description, category, imageData, imageMimeType } = parsed.data;

  try {
    const analysis = await analyzeWithGemini(
      description,
      category ?? undefined,
      imageData ?? undefined,
      imageMimeType ?? undefined
    );
    res.json(analysis);
  } catch (err) {
    req.log.error({ err }, "Gemini analysis failed");
    res.status(500).json({ error: "AI analysis failed. Please try again." });
  }
});

// POST /complaints
router.post("/complaints", async (req, res): Promise<void> => {
  const parsed = CreateComplaintBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;

  const [complaint] = await db
    .insert(complaintsTable)
    .values({
      description: data.description,
      location: data.location,
      category: data.category ?? null,
      imageData: data.imageData ?? null,
      imageMimeType: data.imageMimeType ?? null,
      isAnonymous: data.isAnonymous ?? false,
      reporterName: data.reporterName ?? null,
      status: "pending",
      priority: (data.priority as string) ?? "medium",
      aiAnalyzed: data.aiAnalyzed ?? false,
      aiTitle: data.aiTitle ?? null,
      aiSummary: data.aiSummary ?? null,
      aiCategory: data.aiCategory ?? null,
      aiSeverityScore: data.aiSeverityScore ?? null,
      aiUrgency: data.aiUrgency ?? null,
      aiDepartment: data.aiDepartment ?? null,
      aiEnvironmentalImpact: data.aiEnvironmentalImpact ?? null,
      aiResolutionEstimate: data.aiResolutionEstimate ?? null,
      aiSuggestedActions: data.aiSuggestedActions ?? null,
      aiConfidenceScore: data.aiConfidenceScore ?? null,
    })
    .returning();

  res.status(201).json(complaint);
});

// GET /complaints/:id
router.get("/complaints/:id", async (req, res): Promise<void> => {
  const params = GetComplaintParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [complaint] = await db
    .select()
    .from(complaintsTable)
    .where(eq(complaintsTable.id, params.data.id));

  if (!complaint) {
    res.status(404).json({ error: "Complaint not found" });
    return;
  }

  res.json(complaint);
});

// PATCH /complaints/:id
router.patch("/complaints/:id", async (req, res): Promise<void> => {
  const params = UpdateComplaintParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateComplaintBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Partial<typeof complaintsTable.$inferInsert> = {};
  if (parsed.data.status) updateData.status = parsed.data.status;
  if (parsed.data.priority) updateData.priority = parsed.data.priority;
  if (parsed.data.adminNotes !== undefined)
    updateData.adminNotes = parsed.data.adminNotes;

  const [complaint] = await db
    .update(complaintsTable)
    .set(updateData)
    .where(eq(complaintsTable.id, params.data.id))
    .returning();

  if (!complaint) {
    res.status(404).json({ error: "Complaint not found" });
    return;
  }

  res.json(complaint);
});

// DELETE /complaints/:id
router.delete("/complaints/:id", async (req, res): Promise<void> => {
  const params = DeleteComplaintParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(complaintsTable)
    .where(eq(complaintsTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Complaint not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
