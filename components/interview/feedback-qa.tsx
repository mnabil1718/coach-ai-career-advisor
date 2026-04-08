"use client";

import { FeedbackSchemaType, Interview } from "@/types/interview.type";
import { Feedback } from "./feedback";
import { Button } from "../ui/button";
import { updateStep } from "@/services/interview/interview.service";
import { usePathname, useRouter } from "next/navigation";
import { FinishInterviewButton } from "./finish-interview-button";

export function FeedbackQA({
    step,
    feedback,
    interview,
}: {
    step: number;
    feedback: FeedbackSchemaType | undefined;
    interview: Interview | undefined | null;
}) {

    const router = useRouter();
    const pathname = usePathname();

    const next = async () => {
        const updated = step + 0.5;
        await updateStep(interview!.id, updated);
        const params = new URLSearchParams();
        params.set("interviewId", interview!.id);
        params.set("step", `${updated}`);

        router.push(`${pathname}?${params.toString()}`);
    };

    const back = async () => {
        const updated = step - 0.5;
        await updateStep(interview!.id, updated);
        const params = new URLSearchParams();
        params.set("interviewId", interview!.id);
        params.set("step", `${updated}`);

        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 text-2xl font-semibold mt-12">
                <div className="flex w-fit justify-center items-center p-3 rounded-full bg-accent/20 border">
                    <span className="text-xl">{step - 0.5}/3</span>
                </div>
                <h1>Question No. {step - 0.5} Feedback</h1>
            </div>

            {
                feedback ? (
                    <Feedback data={feedback!} summary={false} />
                ) : (
                    <div className="flex justify-center items-center h-[50vh]">No feedback found</div>
                )
            }

            <div className="flex w-full items-center justify-between gap-4">
                <Button onClick={back} variant="ghost" className="rounded-full">
                    Back
                </Button>

                {step < 3.5 ? (
                    <Button onClick={next} className="font-bold rounded-full px-8">
                        Next Question
                    </Button>
                ) : (
                    <FinishInterviewButton interview={interview!} />
                )}
            </div>
        </div>
    );
}
