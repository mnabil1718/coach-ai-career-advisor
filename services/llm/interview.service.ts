"use server";

import { SELECTED_MODEL } from "@/constants/model";
import { ai } from "@/lib/gemini/gemini";
import { QuestionsArraySchema } from "@/schema/interview.schema";
import { ActionResult } from "@/types/action.type";
import { QuestionsArraySchemaType } from "@/types/interview.type";
import z from "zod";

export async function generateQuestions(targetRole: string, targetRoleLevel: "junior" | "mid" | "senior", cvData: unknown): Promise<ActionResult<QuestionsArraySchemaType>> {

  const prompt = `
    TASK: Generate 3 realistic interview questions for the role: "${targetRole}".
  
    CONTEXT:
    - Role Level: ${targetRoleLevel} (e.g., Junior/Mid/Senior)
    - Candidate Background: ${JSON.stringify(cvData)}

    REQUIREMENTS:
    1. Behavioral: Focus on past experiences (STAR method).
    2. Technical: Focus on role-specific core concepts.
    3. Situational: Focus on "What would you do if..." scenarios.

    Ensure questions are commonly asked in top-tier tech companies. 
    Return exactly 3 questions in the specified JSON format.
  `;

  try {
      const response = await ai.models.generateContent({
    model: SELECTED_MODEL,
    contents: [
        { 
            role: "user", 
            parts: 
            [
                {
                    text: prompt 
                },
            ], 
        },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: z.toJSONSchema(QuestionsArraySchema),
    },
  });

  const json = JSON.parse(response.text ?? "{}");

  const parsed = QuestionsArraySchema.safeParse(json);
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