import z from "zod";

const AnswerSchema = z.string().min(50, "too short. minimum should be 50 characters long").nullable();

export const InterviewFormSchema =  z.object({
    target_role: z.string().min(3, "Cannot be empty. Minimum 3 characters long"),
    target_role_level: z.enum([ "junior", "mid", "senior" ]),
    answers: z.tuple([
        AnswerSchema,
        AnswerSchema,
        AnswerSchema,
    ]).describe("three interview answers, each can be skipped"),
});

export const QuestionSchema = z.object({
    id: z.number(),
    type: z.enum(["behavioral", "technical", "situational"]),
    question: z.string(),
  });


export const QuestionsArraySchema = z.object({
  questions: z.array(QuestionSchema).length(3)
});



