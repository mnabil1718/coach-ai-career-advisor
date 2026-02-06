import z from "zod";

export const AnswerSchema = z.string().min(50, "too short. minimum should be 50 characters long").max(1000, "Cannot exceeds 1000 characters").nullable();

export const AnswerArraySchema = z.array(AnswerSchema).length(3);

export const AnswerFormSchema = z.object({
  text: AnswerSchema,
});

export const StartInterviewFormSchema =  z.object({
    target_role: z.string().min(3, "Cannot be empty. Minimum 3 characters long"),
    target_role_level: z.enum([ "junior", "mid", "senior" ]),
});

export const QuestionSchema = z.object({
    sequence: z.number().int().min(1).max(3).describe("Represents a unique sequence in which the question appears. 1 - 3"),
    type: z.enum(["behavioral", "technical", "situational"]),
    question: z.string(),
  });


export const QuestionsArraySchema = z.array(QuestionSchema).length(3);



export const FeedbackSchema = z.object({
  score: z.number().min(1).max(5), // 1-5 Stars
  strengths: z.string(),
  areasToImprove: z.string(),
  suggestedAnswer: z.string(),
  criteriaScores: z.object({
    structure: z.number(),
    content: z.number(),
    communication: z.number(),
    technicalAccuracy: z.number()
  })
});

export const FeedbacksArraySchema = z.object({
  answers: z.array(FeedbackSchema.nullable()).length(3),
});



