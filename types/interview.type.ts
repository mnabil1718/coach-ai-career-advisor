import { Tables } from "@/database.types";
import { InterviewFormSchema, QuestionsArraySchema, QuestionSchema } from "@/schema/interview.schema";
import z from "zod";

export enum InterviewSteps {
    START = 0,
    Q1 = 1,
    Q2 = 2,
    Q3 = 3,
    FNINSH = 4
};

export type RoleLevel = "junior" | "mid" | "senior";

export type InterviewFormSchemaType = z.infer<typeof InterviewFormSchema>;

export type QuestionSchemaType = z.infer<typeof QuestionSchema>;

export type QuestionsArraySchemaType = z.infer<typeof QuestionsArraySchema>;

export type Interview = Tables<"interview">;

export type InterviewQuestionAnswer = Tables<"interview_qas">;