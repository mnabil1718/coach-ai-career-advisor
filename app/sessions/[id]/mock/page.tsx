import { FeedbackQA } from "@/components/interview/feedback-qa";
import { MockQuestion } from "@/components/interview/mock-question";
import { MockStarter } from "@/components/interview/mock-starter";
import { getInterviewBySessionId } from "@/services/interview/interview.service";

import {
    feedbackFetcher,
    questionFetcher,
    starterFetcher,
} from "@/services/interview/mock-fetcher.service";
import { updateSessionStage } from "@/services/sessions/sessions.service";
import { redirect } from "next/navigation";

export default async function MockPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { id } = await params;
    const { interviewId, step } = await searchParams;

    const { data: interview } = await getInterviewBySessionId(id);

    // redirect to correct steps if interview exists
    if (interview && !step && !interviewId) {
        const p = new URLSearchParams();
        p.set("step", String(interview!.step));
        p.set("interviewId", interview!.id);
        redirect(`/sessions/${id}/mock?${p.toString()}`);
    }

    return (
        <div className="w-full flex-1 flex flex-col items-center">
            <div className="w-full max-w-2xl flex flex-col gap-2 items-center">
                <StepDecider
                    step={Number(step) || 0}
                    sessionId={id}
                    interviewId={interviewId}
                />
            </div>
        </div>
    );
}

async function StepDecider({
    sessionId,
    step,
    interviewId,
}: {
    sessionId: string;
    step: number;
    interviewId: string | string[] | undefined;
}): Promise<React.ReactNode> {
    switch (step) {
        case 0:
            const { parsedCV } = await starterFetcher(sessionId, step, interviewId);
            return <MockStarter sessionId={sessionId} parsedCV={parsedCV} />;

        case 1:
            const {
                interview,
                question,
                answer,
                feedback: qfeedback,
            } = await questionFetcher(sessionId, step, interviewId);
            return (
                <MockQuestion
                    step={step}
                    interview={interview}
                    question={question}
                    answer={answer}
                    feedback={qfeedback}
                />
            );

        case 1.5:
            const { feedback, interview: interviewFeed } = await feedbackFetcher(
                sessionId,
                step,
                interviewId,
            );

            return (
                <FeedbackQA interview={interviewFeed} step={step} feedback={feedback} />
            );

        case 2:
            const {
                interview: interview2,
                question: question2,
                answer: answer2,
                feedback: qfeedback2,
            } = await questionFetcher(sessionId, step, interviewId);
            return (
                <MockQuestion
                    step={step}
                    interview={interview2}
                    question={question2}
                    answer={answer2}
                    feedback={qfeedback2}
                />
            );

        case 2.5:
            const { feedback: feedback2, interview: interviewFeed2 } =
                await feedbackFetcher(sessionId, step, interviewId);

            console.log("FEEDBACK", feedback2, "INTERVIEW FEED", interviewFeed2)

            return (
                <FeedbackQA
                    interview={interviewFeed2}
                    step={step}
                    feedback={feedback2}
                />
            );

        case 3:
            const {
                interview: interview3,
                question: question3,
                answer: answer3,
                feedback: qfeedback3,
            } = await questionFetcher(sessionId, step, interviewId);
            return (
                <MockQuestion
                    step={step}
                    interview={interview3}
                    question={question3}
                    answer={answer3}
                    feedback={qfeedback3}
                />
            );

        case 3.5:
            const { feedback: feedback3, interview: interviewFeed3 } =
                await feedbackFetcher(sessionId, step, interviewId);

            return (
                <FeedbackQA
                    interview={interviewFeed3}
                    step={step}
                    feedback={feedback3}
                />
            );

        // default:
        //   return <MockStarter />;
    }
}
