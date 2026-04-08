import z from "zod";
export const SkillsSchema = z.array(z.string()).nullable().optional();
export const GapsFormSchema = z.object({
    target_role: z.string().min(3, "Cannot be empty. Minimum 3 characters long"),
    skills: SkillsSchema,
});



const LearningRoadmapItemSchema = z.object({
    skill_name: z.string(),
    priority: z.enum(["High", "Medium", "Low"]),
    learning_path: z.string().describe("e.g., Beginner to Intermediate"),
    recommended_resources: z.array(z.string()).describe("List as 'Platform: Course Name (Free/Paid)'"),
    estimated_time: z.string(),
    practice_project: z.string(),
});

export const SkillGapAnalysisSchema = z.object({
    analysis_summary: z.string(),
    match_score: z.string(),
    skills_analysis: z.object({
        matched: z.array(z.string()),
        missing: z.array(z.string()),
        nice_to_have: z.array(z.string()),
    }),
    learning_roadmap: z.array(LearningRoadmapItemSchema),
});


export type SkillGapAnalysisSchemaType = z.infer<typeof SkillGapAnalysisSchema>;
