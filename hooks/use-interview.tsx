import { Json } from "@/database.types";
import {
  createInterview,
  insertQAs,
  saveAnswer,
  saveFeedback,
} from "@/services/interview/interview.service";
import {
  feedbackAnswer,
  generateOverallFeedback,
  generateQuestions,
} from "@/services/llm/interview.service";
import {
  AnswerFormKey,
  FeedbacksArraySchemaType,
  Interview,
  InterviewFormSchemaType,
  InterviewQuestionAnswer,
  QuestionsArraySchemaType,
} from "@/types/interview.type";
import { useState } from "react";
import { toastLoading, toastSuccess } from "@/utils/toast";
import { UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

export const useInterview = (
  form: UseFormReturn<InterviewFormSchemaType>,
  sessionId: string,
  parsedCV: Json,
) => {
  const TOAST_ID = "interview:toast";
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState<number>(Number(params.get("step")) || 0);
  const [loading, setLoading] = useState<boolean>(false);

  const [questions, setQuestions] = useState<QuestionsArraySchemaType>({
    questions: [],
  });
  const [feedbacks, setFeedbacks] = useState<FeedbacksArraySchemaType>({
    answers: [null, null, null],
  });

  // needed to sync qa IDs
  const [qas, setQas] = useState<InterviewQuestionAnswer[]>([]);

  const [interview, setInterview] = useState<Interview | null>(null);

  const incStep = () => {
    setStep((prev) => {
      if (prev < 3) {
        return prev + 1;
      }

      return prev;
    });
  };

  const incHalfStep = () => {
    setStep((prev) => {
      return prev + 0.5;
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

    setInterview(itv!);

    const { data: qs } = await generateQuestions(
      target_role,
      target_role_level,
      parsedCV,
    );
    setQuestions(qs!);

    const { data: qas } = await insertQAs(itv!.id, qs!);
    setQas(qas!);

    setLoading(false);
    toastSuccess("Questions generated", undefined, TOAST_ID);

    setStep(1);
  };

  const finishProcessor = async () => {
    setLoading(true);
    toastLoading("Calculating final result...", undefined, TOAST_ID, true);

    if (interview) {
      await generateOverallFeedback(interview.id);

      toastSuccess("Your interview result is ready", undefined, TOAST_ID);

      setLoading(false);

      router.push(`/sessions/${sessionId}/mock/${interview.id}/result`);
    }

    setLoading(false);
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

    await saveAnswer(qas[idx].id, answer);

    const { data: feedback } = await feedbackAnswer({
      answer,
      question,
      targetRole,
      targetRoleLevel,
    });

    await saveFeedback(qas[idx].id, feedback!);

    setFeedbacks((prev) => {
      if (idx < 0 || idx > 2) {
        return prev;
      }

      const copies = [...prev.answers];

      copies[idx] = feedback!;

      return {
        ...prev,
        answers: copies,
      };
    });

    setLoading(false);
    toastSuccess("Feedback generated", undefined, TOAST_ID);

    incHalfStep();
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
    incHalfStep,
    startProcessor,
    nextProcessor,
    backProcessor,
    finishProcessor,
  };
};
