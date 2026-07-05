import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AiAnalysisResult {
  title: string;
  summary: string;
  category: string;
  severityScore: number;
  urgency: string;
  department: string;
  environmentalImpact: string;
  resolutionEstimate: string;
  suggestedActions: string[];
  confidenceScore: number;
  priority: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  garbage: "Garbage / Waste",
  water_leakage: "Water Leakage",
  broken_streetlight: "Broken Streetlight",
  road_damage: "Road Damage",
  illegal_dumping: "Illegal Dumping",
  public_safety: "Public Safety",
  drainage: "Drainage Issue",
  pothole: "Pothole",
  other: "Other",
};

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  return new GoogleGenerativeAI(apiKey);
}

function isValidAnalysis(obj: unknown): obj is AiAnalysisResult {
  if (typeof obj !== "object" || obj === null) return false;
  const a = obj as Record<string, unknown>;
  return (
    typeof a["title"] === "string" &&
    typeof a["summary"] === "string" &&
    typeof a["category"] === "string" &&
    typeof a["severityScore"] === "number" &&
    typeof a["urgency"] === "string" &&
    typeof a["department"] === "string" &&
    typeof a["environmentalImpact"] === "string" &&
    typeof a["resolutionEstimate"] === "string" &&
    Array.isArray(a["suggestedActions"]) &&
    typeof a["confidenceScore"] === "number" &&
    typeof a["priority"] === "string"
  );
}

export async function analyzeWithGemini(
  description: string,
  category?: string,
  imageData?: string,
  imageMimeType?: string
): Promise<AiAnalysisResult> {
  const client = getClient();
  const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

  const categoryHint = category
    ? `The user has suggested the category: ${CATEGORY_LABELS[category] ?? category}.`
    : "";

  const prompt = `You are an AI assistant for a Smart Community civic issue reporting platform. Analyze the following civic infrastructure complaint and provide a structured assessment.

Description: ${description}
${categoryHint}

Provide a comprehensive analysis in valid JSON format with these exact fields:
{
  "title": "A professional, concise complaint title (max 80 chars)",
  "summary": "A detailed 2-3 sentence professional summary of the issue",
  "category": "One of: garbage, water_leakage, broken_streetlight, road_damage, illegal_dumping, public_safety, drainage, pothole, other",
  "severityScore": <integer 1-10, where 10 is most severe>,
  "urgency": "One of: immediate (fix within 24h), high (fix within 1 week), medium (fix within 1 month), low (schedule for next maintenance cycle)",
  "department": "The government department responsible (e.g. 'Public Works Department', 'Sanitation Department', 'Traffic & Roads Authority', 'Water & Utilities Board', 'Environmental Services', 'Parks & Recreation')",
  "environmentalImpact": "Assessment of environmental impact (1-2 sentences)",
  "resolutionEstimate": "Estimated time to resolve (e.g. '2-3 days', '1-2 weeks', '1 month')",
  "suggestedActions": ["Action 1", "Action 2", "Action 3"],
  "confidenceScore": <float 0.0-1.0 indicating confidence in this analysis>,
  "priority": "One of: low, medium, high, critical"
}

Return ONLY valid JSON, no markdown, no explanation.`;

  const parts: Array<
    | { text: string }
    | { inlineData: { mimeType: string; data: string } }
  > = [{ text: prompt }];

  if (imageData && imageMimeType) {
    // Strip data URL prefix if present
    const base64 = imageData.includes(",")
      ? imageData.split(",")[1]!
      : imageData;
    parts.unshift({
      inlineData: {
        mimeType: imageMimeType,
        data: base64,
      },
    });
    parts.push({
      text: "The image above shows the reported civic issue. Incorporate visual analysis into your assessment.",
    });
  }

  const result = await model.generateContent(parts);
  const text = result.response.text().trim();

  // Strip markdown code blocks if present
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Gemini returned invalid JSON: ${cleaned.slice(0, 200)}`);
  }

  if (!isValidAnalysis(parsed)) {
    throw new Error("Gemini response missing required fields");
  }

  // Clamp values to valid ranges
  parsed.severityScore = Math.max(1, Math.min(10, Math.round(parsed.severityScore)));
  parsed.confidenceScore = Math.max(0, Math.min(1, parsed.confidenceScore));

  return parsed;
}
