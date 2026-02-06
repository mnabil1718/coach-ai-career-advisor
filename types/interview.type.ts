import { Json, Tables } from "@/database.types";
import { FeedbacksArraySchema, FeedbackSchema, StartInterviewFormSchema, QuestionsArraySchema, QuestionSchema, AnswerSchema, AnswerFormSchema, AnswerArraySchema } from "@/schema/interview.schema";
import z from "zod";

export enum InterviewSteps {
    START = 0,
    Q1 = 1,
    Q2 = 2,
    Q3 = 3,
    FNINSH = 4
};

export type AnswerFormKey = "answers.0" | "answers.1" | "answers.2";


export type RoleLevel = "junior" | "mid" | "senior";

export type StartInterviewFormSchemaType = z.infer<typeof StartInterviewFormSchema>;

export type AnswerSchemaType = z.infer<typeof AnswerSchema>; 

export type AnswerArraySchemaType = z.infer<typeof AnswerArraySchema>; 

export type AnswerFormSchemaType = z.infer<typeof AnswerFormSchema>; 

export type QuestionSchemaType = z.infer<typeof QuestionSchema>;

export type QuestionsArraySchemaType = z.infer<typeof QuestionsArraySchema>;

export type FeedbackSchemaType = z.infer<typeof FeedbackSchema>;

export type FeedbacksArraySchemaType = z.infer<typeof FeedbacksArraySchema>;

export type Interview = Tables<"interview">;

export type InterviewQuestionAnswer = Tables<"interview_qas">;

export type AnswerFeedBackRequest = {
    targetRole: string;
    targetRoleLevel: string;
    question: QuestionSchemaType;
    answer: string | null;
};

export type StartInterviewRequest = {
    sessionId: string;
    parsedCVData: Json;
    target_role: string;
    target_role_level: RoleLevel;
}

export type QuestionAnswerPair = {
    question: QuestionSchemaType;
    answer: AnswerSchemaType; 
}