import { AnswerOverview } from "@/components/interview/answer-overview";
import { Feedback } from "@/components/interview/feedback";
import { Button } from "@/components/ui/button";

import { FeedbackSchema } from "@/schema/interview.schema";
import {
  getInterview,
  getQuestionAnswersByInterviewId,
} from "@/services/interview/interview.service";
import {
  AnswerArraySchemaType,
  FeedbackSchemaType,
  QuestionAnswerPair,
  QuestionsArraySchemaType,
} from "@/types/interview.type";
import { validateData } from "@/utils/parse";
import Link from "next/link";

export default async function MockResultPage({
  params,
}: {
  params: Promise<{ id: string; interviewId: string }>;
}) {
  const { id, interviewId } = await params;

  const { data: interview } = await getInterview(interviewId);

  const result = validateData<FeedbackSchemaType>(
    FeedbackSchema,
    interview!.result,
  );

  const { data: qas } = await getQuestionAnswersByInterviewId(interviewId);

  const qa: QuestionAnswerPair[] = qas!.map((qa) => {
    return {
      question: {
        question: qa.question,
        sequence: qa.step,
        type: qa.type as "behavioral" | "technical" | "situational",
      },
      answer: qa.answer,
    };
  });

  return (
    <div className="w-full flex-1 flex flex-col items-center">
      <div className="w-full max-w-4xl flex flex-col gap-2 items-center mb-12">
        <h1 className="text-2xl font-medium mt-12 mb-7">
          Interview Performance Report
        </h1>

        <AnswerOverview pairs={qa} />

        <Feedback data={result} />

        <div className="flex w-full items-center justify-between gap-4 mt-7">
          <Link href={"/dashboard"}>
            <Button type="button" variant="ghost" className="rounded-full">
              Back to Dashboard
            </Button>
          </Link>

          <Link href={`/sessions/${id}/gaps`}>
            <Button type="button" className="rounded-full font-bold">
              Next: Check skill gaps
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
