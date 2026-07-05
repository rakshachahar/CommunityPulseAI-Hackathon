import {
  pgTable,
  text,
  serial,
  timestamp,
  boolean,
  integer,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const complaintsTable = pgTable("complaints", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  category: text("category"),
  imageData: text("image_data"),
  imageMimeType: text("image_mime_type"),
  status: text("status").notNull().default("pending"),
  priority: text("priority").notNull().default("medium"),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  reporterName: text("reporter_name"),
  adminNotes: text("admin_notes"),
  aiAnalyzed: boolean("ai_analyzed").notNull().default(false),
  aiTitle: text("ai_title"),
  aiSummary: text("ai_summary"),
  aiCategory: text("ai_category"),
  aiSeverityScore: integer("ai_severity_score"),
  aiUrgency: text("ai_urgency"),
  aiDepartment: text("ai_department"),
  aiEnvironmentalImpact: text("ai_environmental_impact"),
  aiResolutionEstimate: text("ai_resolution_estimate"),
  aiSuggestedActions: text("ai_suggested_actions"),
  aiConfidenceScore: real("ai_confidence_score"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertComplaintSchema = createInsertSchema(complaintsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type Complaint = typeof complaintsTable.$inferSelect;
