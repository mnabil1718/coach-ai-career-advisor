"use server";

import { SELECTED_MODEL } from "@/constants/model";
import { ai } from "@/lib/gemini/gemini";
import { SkillGapAnalysisSchema, SkillGapAnalysisSchemaType } from "@/schema/gaps.schema";
import { ActionResult } from "@/types/action.type";
import z from "zod";


export async function analyzeSkillGaps(target_role: string, skills: string[]): Promise<ActionResult<SkillGapAnalysisSchemaType>> {
    const prompt = `
            Perform a skill gap analysis for the following user:

            - Target Role: ${target_role}
            - Current Skills: ${skills.join(", ")}

            Compare the current skills against the requirements for a {{target_role}}. 
            For 'Missing' skills, provide a learning path including priority, specific course names (Udemy, Coursera, YouTube, etc.), estimated time, and a practice project idea.
    `;

      try {
        const response = await ai.models.generateContent({
        model: SELECTED_MODEL,
        contents: prompt,
        config: {
            temperature: 0.3,
            responseMimeType: "application/json",
            responseSchema: z.toJSONSchema(SkillGapAnalysisSchema),
            systemInstruction: "You are an expert Interviewer at big multinational company (FAANG/MAANG). Analyze the user's skill gap for targeted role."
        },
      });
    
      const json = JSON.parse(response.text ?? "{}");
    
      const parsed = SkillGapAnalysisSchema.safeParse(json);
      if (!parsed.success) {
        throw new Error("AI response format not recognized");
      }
    
      return { data: parsed.data };
    
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
    
        throw new Error('AI generation failed');
      }
}