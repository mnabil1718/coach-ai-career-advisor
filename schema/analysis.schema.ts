import { z } from "zod";

export const AnalysisSchema = z.object({
  overallScore: z.number().min(0).max(10),
  categories: z.object({
    contentQuality: z.number(),
    structureFormat: z.number(),
    atsOptimization: z.number(),
    skillsKeywords: z.number(),
  }),
  recommendations: z.array(z.object({
    priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
    category: z.string(),
    title: z.string(),
    feedback: z.string(),
    before: z.string().optional(),
    after: z.string().optional(),
    actionItem: z.string()
  }))
});

export type AnalysisSchemaType = z.infer<typeof AnalysisSchema>;

export type RecommendationsType = AnalysisSchemaType["recommendations"];
export type RecommendationItemType = AnalysisSchemaType["recommendations"][number];