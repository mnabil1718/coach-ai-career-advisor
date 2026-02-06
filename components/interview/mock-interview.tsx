"use client";

import { Input } from "../ui/input";
import {
  AnswerFormKey,
  FeedbackSchemaType,
  InterviewFormSchemaType,
  StartInterviewFormSchemaType,
} from "@/types/interview.type";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Button } from "../ui/button";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { Required } from "../form/required-span";
import { Json } from "@/database.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { LoaderCircle, Lightbulb, MessageSquare } from "lucide-react";

import {
  InterviewProvider,
  useInterviewContext,
} from "@/context/interview-context";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/input-group";
import React from "react";
import { Feedback } from "./feedback";
import { Badge } from "../ui/badge";
import { PrimaryButton } from "../primary-button";
import { StartInterviewFormSchema } from "@/schema/interview.schema";
import { zodResolver } from "@hookform/resolvers/zod";

type MockInterviewProps = {
  sessionId: string;
  parsedCVData: Json;
  step: number;
};

export function MockInterview({
  sessionId,
  parsedCVData,
  step,
}: MockInterviewProps) {
  return (
    <InterviewProvider
      sessionId={sessionId}
      parsedCV={parsedCVData}
      step={step}
    >
      <div className="w-full">
        <StepDecider />
      </div>
    </InterviewProvider>
  );
}

// function StepDecider(): React.ReactNode {
//   const { step, feedbacks, backProcessor } = useInterviewContext();
//   const feedback = feedbacks.answers[Math.floor(step) - 1];

//   switch (step) {
//     case 0:
//       return <RoleInput />;

//     case 1:
//       return <QA index={0} />;

//     case 1.5:
//       if (!feedback) {
//         backProcessor();
//         return;
//       }

//       return <FeedbackView index={Math.floor(step) - 1} data={feedback} />;

//     case 2:
//       return <QA index={1} />;

//     case 2.5:
//       if (!feedback) {
//         backProcessor();
//         return;
//       }

//       return <FeedbackView index={Math.floor(step) - 1} data={feedback} />;

//     case 3:
//       return <QA index={2} />;

//     case 3.5:
//       if (!feedback) {
//         backProcessor();
//         return;
//       }

//       return <FeedbackView index={Math.floor(step) - 1} data={feedback} />;

//     default:
//       return <RoleInput />;
//   }
// }

export function RoleInput() {
  const form = useForm<StartInterviewFormSchemaType>({
    resolver: zodResolver(StartInterviewFormSchema),
    mode: "onChange",
    defaultValues: {
      target_role: "",
      target_role_level: "junior",
    },
  });
  // const { loading, startProcessor } = useInterviewContext();

  const start = async () => {
    const valid = await form.trigger();

    if (!valid) return;

    // startProcessor();
  };

  return (
    <div className="max-w-md mx-auto">
      <header className="my-12 text-center">
        <h1 className="text-xl font-medium mb-2">Start Mock Interview</h1>
      </header>

      <form onSubmit={form.handleSubmit(start)}>
        <FieldGroup>
          <Controller
            name="target_role"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="target_role" className="gap-1">
                  Input Target Role
                  <Required />
                </FieldLabel>
                <Input
                  {...field}
                  id="target_role"
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g. Software Engineer"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="target_role_level"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="responsive" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="target-role-level">
                    Target Role Level
                  </FieldLabel>
                  <FieldDescription>
                    For best results, select role level you wish to achieve.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="target-role-level"
                    aria-invalid={fieldState.invalid}
                    className="min-w-[120px]"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="mid">Mid-level</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </FieldGroup>
        <div className="flex w-full justify-center mt-6">
          <PrimaryButton
            text="Start Interview"
            type={"submit"}
            loading={form.formState.isSubmitting}
            loadingText="Starting..."
          />
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

function FinishInterviewButton() {
  const form = useFormContext<InterviewFormSchemaType>();
  const { finishProcessor, loading } = useInterviewContext();

  return (
    <Button
      disabled={form.formState.isSubmitting || loading}
      onClick={finishProcessor}
      className="font-bold rounded-full px-8"
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <LoaderCircle className="animate-spin" /> <span>Processing...</span>
        </div>
      ) : (
        "Finish Interview"
      )}
    </Button>
  );
}

function QA({ index }: { index: number }) {
  const form = useFormContext<InterviewFormSchemaType>();
  const {
    step,
    loading,
    nextProcessor,
    backProcessor,
    questions,
    feedbacks,
    incHalfStep,
  } = useInterviewContext();

  const feedback = feedbacks.answers[index];

  const fieldName = `answers.${index}` as const as AnswerFormKey;

  const skipHandler = () => {
    form.clearErrors(fieldName);
    form.setValue(fieldName, null);
    nextProcessor(index);
  };

  const nextHandler = async () => {
    const val = form.getValues(fieldName);
    form.setValue(fieldName, val ?? "");
    const valid = await form.trigger(fieldName);

    if (valid) {
      nextProcessor(index);
    }
  };

  const renderSubmit = (): React.ReactNode => {
    if (loading && !feedback) {
      return (
        <Button
          disabled={form.formState.isSubmitting || loading}
          onClick={nextHandler}
          className="font-bold rounded-full px-8"
        >
          <div className="flex items-center gap-2">
            <LoaderCircle className="animate-spin" />
            <span>Analyzing...</span>
          </div>
        </Button>
      );
    } else if (!loading) {
      return (
        <Button
          disabled={form.formState.isSubmitting || loading}
          onClick={nextHandler}
          className="font-bold rounded-full px-8"
        >
          Submit
        </Button>
      );
    } else if (step >= 3.5 && feedback) {
      // Finalize
      return <FinishInterviewButton />;
    }
  };

  return (
    <div className="w-full mb-12">
      {feedback && (
        <div className="flex justify-end">
          <Button
            onClick={incHalfStep}
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
        <QBadge type={questions.questions[index].type} />
        <span className="text-sm text-muted-foreground mb-6">
          Question {index + 1}/3
        </span>
      </div>

      <h2 className="text-lg leading-loose mb-10 text-center">
        {questions.questions[index].question}
      </h2>

      <STARMethodTip />

      <Controller
        name={fieldName}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="w-full mb-10">
            <InputGroup>
              <InputGroupTextarea
                {...field}
                // Cast field.value to string to resolve the [string | null, ...] mismatch
                value={(field.value as string) ?? ""}
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
        <Button
          type="button"
          variant="ghost"
          className="rounded-full"
          onClick={backProcessor}
        >
          Back
        </Button>

        <div className="flex items-center gap-2">
          {renderSubmit()}

          {index < 2 && (
            <Button
              type="button"
              variant={"ghost"}
              onClick={skipHandler}
              className="text-muted-foreground rounded-full"
            >
              Skip
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function FeedbackView({
  index,
  data,
}: {
  index: number;
  data: FeedbackSchemaType;
}) {
  const { step, setStep } = useInterviewContext();

  const next = () => {
    setStep((prev) => Math.floor(prev) + 1);
  };

  const back = () => {
    setStep((prev) => prev - 0.5);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center text-center gap-4 mb-10">
        {index !== undefined ? (
          <Badge className="bg-accent/20 hover:bg-accent/20 p-1 border border-border text-foreground font-medium rounded-full text-sm px-3 shadow-none">
            Question {index + 1} Feedback
          </Badge>
        ) : null}

        {/* <div className="space-y-1">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-7xl font-bold tracking-tight">
              {data.score}
            </span>
            <span className="text-2xl text-muted-foreground/50 font-medium">
              / 5
            </span>
          </div>
          <div className="flex items-center gap-1 text-chart-4">
            {renderStars(data.score)}
          </div>
        </div> */}
      </div>

      <Feedback data={data} index={index} />

      <div className="flex w-full items-center justify-between gap-4">
        <Button onClick={back} variant="ghost" className="rounded-full">
          Back
        </Button>

        {step < 3.5 ? (
          <Button onClick={next} className="font-bold rounded-full px-8">
            Next Question
          </Button>
        ) : (
          <FinishInterviewButton />
        )}
      </div>
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
