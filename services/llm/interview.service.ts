"use server";

import { SELECTED_MODEL } from "@/constants/model";
import { ai } from "@/lib/gemini/gemini";
import { FeedbackSchema, QuestionsArraySchema } from "@/schema/interview.schema";
import { ActionResult } from "@/types/action.type";
import { AnswerFeedBackRequest, FeedbackSchemaType, QuestionsArraySchemaType, RoleLevel } from "@/types/interview.type";
import z from "zod";
import { getInterviewWithRelations, saveInterviewResult } from "../interview/interview.service";

export async function generateQuestions(targetRole: string, targetRoleLevel: RoleLevel, cvData: unknown): Promise<ActionResult<QuestionsArraySchemaType>> {

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
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: z.toJSONSchema(QuestionsArraySchema),
      systemInstruction: `
          You are an expert Technical Recruiter with experience hiring at top-tier tech companies (FAANG/MAANG). 
          Your goal is to generate high-quality, challenging, and relevant interview questions based on a candidate's CV and target role.`
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

export async function feedbackAnswer({ question, answer, targetRole, targetRoleLevel }: AnswerFeedBackRequest): Promise<ActionResult<FeedbackSchemaType>> {
  const prompt = `
  TASK: Act as an expert Interviewer. Analyze the user's answer to the following question.
  
  QUESTION: "${question.question}"
  QUESTION TYPE: "${question.type}"
  USER ANSWER: "${answer}"
  TARGET ROLE: "${targetRole}"
  TARGET ROLE LEVEL: "${targetRoleLevel}"

  EVALUATION CRITERIA:
  1. Structure (25%): Logical flow, STAR method for behavioral.
  2. Content (35%): Specificity, quantifiable results, relevance.
  3. Communication (20%): Clarity and professional tone.
  4. Technical Accuracy (20%): Correctness of concepts.

  INSTRUCTIONS:
  - Provide constructive feedback.
  - If the answer is too short (less than 50 words), penalize the score and suggest more detail.
  - For "suggestedAnswer", write a high-quality model response using the STAR method. But use paragraph-like human readable sentence. Don't use object format.
  `;

  try {
      const response = await ai.models.generateContent({
    model: SELECTED_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: z.toJSONSchema(FeedbackSchema),
      systemInstruction: "You are an expert Interviewer at big multinational company (FAANG/MAANG). Analyze the user's answer to the following question."
    },
  });

  const json = JSON.parse(response.text ?? "{}");

  const parsed = FeedbackSchema.safeParse(json);
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

export async function generateOverallFeedback(interviewId: string): Promise<ActionResult<FeedbackSchemaType>> {
  try {

    const context = await getInterviewWithRelations(interviewId);
    
    const sessionHistory = context.interview_qas.map((qa, i) => `
      QUESTION ${i + 1}: ${qa.question}
      ANSWER: ${qa.answer ?? "No answer provided"}
      INDIVIDUAL FEEDBACK: ${JSON.stringify(qa.feedback)}
    `).join("\n---\n");

    const prompt = `
      TASK: Provide a final summary and overall score for the interview.
      TARGET ROLE: ${context.target_role}
      LEVEL: ${context.target_role_level}

      SESSION HISTORY:
      ${sessionHistory}

      INSTRUCTIONS:
      - Aggregate the scores from individual feedbacks to provide an "overallScore".
      - In "feedback", provide a high-level summary of strengths and weaknesses.
      - In "suggestedAnswer", provide a "Roadmap for Improvement" based on their performance across all questions.
    `;

    const response = await ai.models.generateContent({
      model: SELECTED_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: z.toJSONSchema(FeedbackSchema),
        systemInstruction: "You are a Senior Hiring Manager. Provide a final decision-style evaluation."
      },
    });

    const json = JSON.parse(response.text ?? "{}");
    const parsed = FeedbackSchema.safeParse(json);
    
    if (!parsed.success) throw new Error("AI evaluation failed");

    await saveInterviewResult(interviewId, parsed.data);

    return { data: parsed.data };

  } catch (error: unknown) {

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('AI generation failed');
  }
}