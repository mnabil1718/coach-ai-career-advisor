"use server"

import { SELECTED_MODEL } from "@/constants/model";
import { ai } from "@/lib/gemini/gemini";
import { ParseResumeResponse, ParseResumeResponseType, } from "@/schema/resume.schema";
import { ActionResult } from "@/types/action.type";
import { ApiError } from "@google/genai"

export async function formatParse(txt: string): Promise<ActionResult<ParseResumeResponseType>> {
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
            model: SELECTED_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: ParseResumeResponse
            },
        });

        const json = JSON.parse(response.text ?? "{}");

        return { data: json }

    } catch (err: unknown) {

        if (err instanceof Error) {
            throw err;
        }

        throw new Error('AI generation failed');
    }
}
