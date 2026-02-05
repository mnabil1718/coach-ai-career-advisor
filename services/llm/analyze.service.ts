"use server"

import { ai } from "@/lib/gemini/gemini";
import { SELECTED_MODEL } from "@/constants/model";
import { AnalysisSchema, AnalysisSchemaType } from "@/schema/analysis.schema";
import { ParseResumeSchemaType } from "@/schema/resume.schema";
import z from "zod";
import { ActionResult } from "@/types/action.type";

export async function analyzeCV(data: ParseResumeSchemaType): Promise<ActionResult<AnalysisSchemaType>> {

  const prompt = `
    TASK: Analyze the following parsed CV data based on the PRD criteria:
    
    1. Content Quality (40%): Check for quantifiable results (numbers/%) and action verbs.
    2. Structure & Format (30%): Check for missing contact info or clear sections.
    3. ATS Optimization (20%): Check for standard headers and readable formats.
    4. Skills (10%): Check for industry-standard technical vs soft skills.

    DATA TO ANALYZE (JSON):
    ${JSON.stringify(data)}

    INSTRUCTIONS:
    - Provide 5-7 concrete, actionable suggestions.
    - Order from highest priority to lowest.
    - For the "before" field: Extract the exact, verbatim sentence or bullet point from the original CV. transform it into sentence format that is human readable.
    - For the "after" field: Rewrite that specific line into a high-impact, results-oriented sentence. Ensure it is a complete, ready-to-use sentence, not a summary and also human readable.
    - If skills are missing for their apparent role (e.g., a Frontend dev missing "React"), suggest them.
    - Return the response strictly as JSON.
  `;

  try {
      const response = await ai.models.generateContent({
    model: SELECTED_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: z.toJSONSchema(AnalysisSchema),
      systemInstruction: 'You are an expert Technical Recruiter and ATS Specialist.',
    },
  });

  const json = JSON.parse(response.text ?? "{}");

  const parsed = AnalysisSchema.safeParse(json);
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