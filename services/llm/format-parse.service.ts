"use server"

import { ai } from "@/lib/gemini/gemini";
import { ResumeSchema } from "@/schema/resume.schema";
import { ActionResult } from "@/types/action.type";

export async function formatParse(txt: string): Promise<ActionResult<string>> {
const prompt = `
        TASK: Extract resume data.
        
        CRITICAL INSTRUCTION: 
        If the provided text is NOT a resume, or if specific fields (like work experience or name) 
        are not present, return "null" or an empty array [] for those fields. 
        DO NOT guess, DO NOT hallucinate, and DO NOT try to interpret non-resume text as a resume.
    
        CV TEXT:
        ${txt}
      `;

  try {

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        responseSchema: ResumeSchema
    },    
  });

  return { error: null, data: response.text }

  } catch (err: unknown) {
    if (err instanceof Error) {
      return { error: err.message }
    }

    return { error: 'AI generation failed' }
  }

  
}