"use client";

import { AnswerFormSchema } from "@/schema/interview.schema";
import {
    AnswerFormSchemaType,
    FeedbackSchemaType,
    Interview,
    QuestionSchemaType,
} from "@/types/interview.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Field, FieldDescription, FieldError } from "../ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "../ui/input-group";
import { PrimaryButton } from "../primary-button";
import {
    deleteInterview,
    saveAnswer,
    saveFeedback,
    updateStep,
} from "@/services/interview/interview.service";
import { feedbackAnswer } from "@/services/llm/interview.service";
import { Lightbulb, MessageSquare } from "lucide-react";

export type MockQuestionProps = {
    step: number;
    answer?: string | null;
    interview: Interview;
    question: QuestionSchemaType;
    feedback?: FeedbackSchemaType;
};

export function MockQuestion({
    step,
    answer,
    interview,
    question,
    feedback,
}: MockQuestionProps) {
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm<AnswerFormSchemaType>({
        resolver: zodResolver(AnswerFormSchema),
        mode: "onChange",
        defaultValues: {
            text: answer, // so DB can receive null not ""
        },
    });

    const reset = async () => {
        await deleteInterview(interview.id);
        router.push(pathname)
    };

    const skip = async () => {
        const answer = form.getValues("text") || null;
        await saveAnswer(interview.id, step, answer);

        const updated = step + 1;
        await updateStep(interview.id, updated);

        const params = new URLSearchParams();
        params.set("interviewId", interview.id);
        params.set("step", `${updated}`);

        router.push(`${pathname}?${params.toString()}`);
    };

    const back = async () => {
        const updated = step - 0.5;
        await updateStep(interview.id, updated);
        const params = new URLSearchParams();
        params.set("interviewId", interview.id);
        params.set("step", `${updated}`);

        router.push(`${pathname}?${params.toString()}`);
    };

    const next = async () => {
        const text = form.getValues("text");
        form.setValue("text", text ?? "");
        const valid = await form.trigger("text");

        if (valid) {
            const answer = form.getValues("text");
            await saveAnswer(interview.id, step, answer);

            const { data: feedback } = await feedbackAnswer({
                answer,
                question,
                targetRole: interview.target_role,
                targetRoleLevel: interview.target_role_level,
            });

            await saveFeedback(interview.id, step, feedback!);

            await updateStep(interview.id, step + 0.5);

            const params = new URLSearchParams();
            params.set("interviewId", interview.id);
            params.set("step", `${step + 0.5}`);

            router.push(`${pathname}?${params.toString()}`);
        }
    };

    const seeFeedback = async () => {
        const updated = step + 0.5;
        await updateStep(interview.id, updated);

        const params = new URLSearchParams();
        params.set("interviewId", interview.id);
        params.set("step", `${updated}`);

        router.push(`${pathname}?${params.toString()}`);
    };

    const renderSubmit = (): React.ReactNode => {
        if (!feedback) {
            return (
                <PrimaryButton
                    text="Submit"
                    type={"submit"}
                    loading={form.formState.isSubmitting}
                />
            );
        }

        return (
            <PrimaryButton
                text="Update"
                type={"submit"}
                loading={form.formState.isSubmitting}
            />
        );
    };

    const renderBack = (): React.ReactNode => {
        if (step === 1) {
            return (
                <Button
                    onClick={reset}
                    type="button"
                    variant={"destructive"}
                    className="rounded-full"
                >
                    Reset
                </Button>
            );
        }

        return (
            <Button
                onClick={back}
                type="button"
                variant="ghost"
                className="rounded-full"
            >
                Back
            </Button>
        );
    };

    return (
        <div className="w-full mb-12">
            {feedback && (
                <div className="flex justify-end">
                    <Button
                        onClick={seeFeedback}
                        size={"sm"}
                        variant={"ghost"}
                        className="rounded-full border-primary/30 mb-10 text-primary"
                    >
                        <MessageSquare />
                        <span>See Feedback</span>
                    </Button>
                </div>
            )}
            <div className="flex flex-col w-full items-center">
                <QBadge type={question.type} />
                <span className="text-sm text-muted-foreground mb-6">
                    Question {step}/3
                </span>
            </div>

            <h2 className="text-lg leading-loose mb-10 text-center">
                {question.question}
            </h2>

            <STARMethodTip />

            <form onSubmit={form.handleSubmit(next)}>
                <Controller
                    name="text"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="w-full mb-10">
                            <InputGroup>
                                <InputGroupTextarea
                                    {...field}
                                    value={field.value ?? ""}
                                    placeholder="Enter your answer..."
                                    className="min-h-[120px]"
                                />
                                <InputGroupAddon
                                    align="block-end"
                                    className="w-full flex justify-end"
                                >
                                    <InputGroupText className="text-xs text-muted-foreground font-normal ml-auto">
                                        {field.value?.length ?? 0}/1000
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                            {!fieldState.invalid && (
                                <FieldDescription>Minimum 50 characters</FieldDescription>
                            )}
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <div className="flex w-full items-center justify-between gap-4">
                    {renderBack()}

                    <div className="flex items-center gap-2">
                        {renderSubmit()}

                        {step < 3 && (
                            <Button
                                type="button"
                                variant={"ghost"}
                                onClick={skip}
                                className="text-muted-foreground rounded-full"
                            >
                                Skip
                            </Button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}

function QBadge({ type }: { type: string }) {
    return (
        <div className="px-3.5 py-1.5 border text-sm font-medium rounded-full bg-accent/30 mb-2">
            <span>{type[0].toUpperCase()}</span>
            <span>{type.slice(1)}</span>
        </div>
    );
}

export function STARMethodTip() {
    return (
        <div className="group relative flex items-start gap-5 rounded-xl bg-accent/20 p-5 text-xs mb-5">
            <div className="flex p-2 rounded-full justify-center items-center bg-primary/5">
                <Lightbulb className="text-primary" />
            </div>

            <div className="space-y-2">
                <p className="text-muted-foreground font-medium leading-none">
                    Tip: Use the STAR method to answer
                </p>
                <p className="text-muted-foreground">
                    Structure your answer by defining the Situation, the Task at hand, the
                    Action you took, and the Result achieved.
                </p>
            </div>
        </div>
    );
}
