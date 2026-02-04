import { Json } from "@/database.types";
import {
  createInterview,
  insertQAs,
} from "@/services/interview/interview.service";
import {
  feedbackAnswer,
  generateQuestions,
} from "@/services/llm/interview.service";
import {
  AnswerFormKey,
  FeedbacksArraySchemaType,
  InterviewFormSchemaType,
  QuestionsArraySchemaType,
} from "@/types/interview.type";
import { toastLoading, toastSuccess } from "@/utils/toast";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

export const useInterview = (
  form: UseFormReturn<InterviewFormSchemaType>,
  sessionId: string,
  parsedCV: Json,
) => {
  const TOAST_ID = "interview:toast";
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [questions, setQuestions] = useState<QuestionsArraySchemaType>({
    questions: [],
  });
  const [feedbacks, setFeedbacks] = useState<FeedbacksArraySchemaType>({
    answers: [],
  });

  const incStep = () => {
    setStep((prev) => {
      if (prev < 3) {
        return prev + 1;
      }

      return prev;
    });
  };

  const decStep = () => {
    setStep((prev) => {
      if (prev > 0) {
        return prev - 1;
      }

      return prev;
    });
  };

  const startProcessor = async () => {
    setLoading(true);
    toastLoading("Generating questions...", undefined, TOAST_ID, true);

    const target_role = form.getValues("target_role");
    const target_role_level = form.getValues("target_role_level");
    const { data: itv } = await createInterview(
      sessionId,
      target_role,
      target_role_level,
    );

    const { data: qs } = await generateQuestions(
      target_role,
      target_role_level,
      parsedCV,
    );

    await insertQAs(itv!.id, qs!);
    setQuestions(qs!);

    setLoading(false);
    toastSuccess("Questions generated", undefined, TOAST_ID);

    setStep(1);
  };

  const nextProcessor = async (idx: number) => {
    setLoading(true);

    const targetRole = form.getValues("target_role");
    const targetRoleLevel = form.getValues("target_role_level");
    const answer = form.getValues(`answers.${idx}` as const as AnswerFormKey);
    const question = questions.questions[idx];

    if (answer === null) {
      incStep();
      setLoading(false);
      return;
    }

    toastLoading("Analyzing answer...", undefined, TOAST_ID, true);

    const { data: feedback } = await feedbackAnswer({
      answer,
      question,
      targetRole,
      targetRoleLevel,
    });

    console.log("FEEDBACK", feedback);

    setFeedbacks((prev) => ({
      ...prev,
      answers: prev.answers.map((item, i) => (i === idx ? feedback! : item)),
    }));

    setLoading(false);
    toastSuccess("Feedback generated", undefined, TOAST_ID);

    incStep();
  };

  const backProcessor = () => {
    if (step === 1) {
      // reset interview if back to starting page
      form.reset({
        target_role: "",
        target_role_level: "junior",
        answers: [null, null, null],
      });
    }

    decStep();
  };

  return {
    step,
    setStep,
    questions,
    setQuestions,
    feedbacks,
    setFeedbacks,
    loading,
    setLoading,
    incStep,
    decStep,
    startProcessor,
    nextProcessor,
    backProcessor,
  };
};
