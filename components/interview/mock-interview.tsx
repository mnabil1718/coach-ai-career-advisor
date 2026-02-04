"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import {
  InterviewFormSchemaType,
  InterviewSteps,
  QuestionsArraySchemaType,
  QuestionSchemaType,
  RoleLevel,
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
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { InterviewFormSchema } from "@/schema/interview.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Required } from "../form/required-span";
import { Json } from "@/database.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { generateQuestions } from "@/services/llm/interview.service";
import { LoaderCircle } from "lucide-react";
import { toastLoading, toastSuccess } from "@/utils/toast";
import {
  createInterview,
  insertQAs,
} from "@/services/interview/interview.service";
import { Textarea } from "../ui/textarea";

type MockInterviewProps = {
  sessionId: string;
  parsedCVData: Json;
};

const TOAST_ID = "mocking";

export function MockInterview({ sessionId, parsedCVData }: MockInterviewProps) {
  const [step, setStep] = useState<number>(0);

  const [q, setQ] = useState<QuestionsArraySchemaType>({ questions: [] });
  const form = useForm<InterviewFormSchemaType>({
    resolver: zodResolver(InterviewFormSchema),
    mode: "onBlur",
    defaultValues: {
      target_role: "",
      target_role_level: "junior",
      answers: [null, null, null],
    },
  });

  const start = async (target_role: string, target_role_level: RoleLevel) => {
    toastLoading("Generating questions...", undefined, TOAST_ID, true);
    const { data: itv } = await createInterview(
      sessionId,
      target_role,
      target_role_level,
    );

    const { data: qs } = await generateQuestions(
      target_role,
      target_role_level,
      parsedCVData,
    );

    await insertQAs(itv!.id, qs!);
    setQ(qs!);

    setStep(1);

    toastSuccess("Questions generated", undefined, TOAST_ID);
  };

  const nextHandler = () => {
    setStep((prev) => {
      if (prev < 3) {
        return prev + 1;
      }

      return prev;
    });
  };

  const backHandler = () => {
    if (step === 1) {
      // reset interview if back to starting page
      form.reset({
        target_role: "",
        target_role_level: "junior",
        answers: [null, null, null],
      });
    }

    setStep((prev) => {
      if (prev > 0) {
        return prev - 1;
      }

      return prev;
    });
  };

  function stepDecider(step: InterviewSteps): React.ReactNode {
    switch (step) {
      case 0:
        return <RoleInput form={form} submitCallback={start} />;

      case 1:
        return (
          <QA
            form={form}
            nextCallback={nextHandler}
            backHandler={backHandler}
            index={0}
            q={q.questions[0]}
          />
        );

      case 2:
        return (
          <QA
            form={form}
            nextCallback={nextHandler}
            backHandler={backHandler}
            index={1}
            q={q.questions[1]}
          />
        );

      case 3:
        return (
          <QA
            form={form}
            nextCallback={nextHandler}
            backHandler={backHandler}
            index={2}
            q={q.questions[2]}
          />
        );

      default:
        return <RoleInput form={form} submitCallback={start} />;
    }
  }

  return (
    <div className="w-full">
      <div className="max-w-md mx-auto">{stepDecider(step)}</div>
    </div>
  );
}

function RoleInput({
  form,
  submitCallback,
}: {
  form: UseFormReturn<InterviewFormSchemaType>;
  submitCallback: (target_role: string, target_role_level: RoleLevel) => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  const startHandler = async () => {
    const valid = await form.trigger();

    if (!valid) {
      // ADD THIS: It will tell you exactly why validation is failing
      console.log("Validation Failed:", form.formState.errors);
      return;
    }

    console.log("LOCAL START", valid);
    setLoading(true);

    const target_role = form.getValues("target_role");
    const target_role_level = form.getValues("target_role_level");

    submitCallback(target_role, target_role_level);
  };

  return (
    <div>
      <header className="my-12 text-center">
        <h1 className="text-xl font-medium mb-2">Start Mock Interview</h1>
      </header>

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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
        <Button
          disabled={loading}
          type="submit"
          className="font-bold rounded-full"
          onClick={startHandler}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <LoaderCircle className="animate-spin" />
              <span>Starting...</span>
            </div>
          ) : (
            "Start Interview"
          )}
        </Button>
      </div>
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

function QA({
  q,
  index,
  form,
  nextCallback,
  backHandler,
}: {
  index: number;
  q: QuestionSchemaType;
  form: UseFormReturn<InterviewFormSchemaType>;
  nextCallback: () => void;
  backHandler: () => void;
}) {
  const fieldName = `answers.${index}` as const as
    | `answers.0`
    | `answers.1`
    | `answers.2`;

  const skipHandler = () => {
    form.clearErrors(fieldName);
    form.setValue(fieldName, null);
    nextCallback();
  };

  const nextHandler = async () => {
    const currentValue = form.getValues(fieldName);
    form.setValue(fieldName, currentValue ?? "");
    const valid = await form.trigger(fieldName);

    if (valid) {
      nextCallback();
    }
  };

  const value = form.watch(fieldName);

  return (
    <div>
      <div className="flex flex-col w-full items-center">
        <QBadge type={q.type} />
        <span className="text-sm text-muted-foreground mb-6">
          Question {index + 1}/3
        </span>
      </div>

      <h2 className="text-lg leading-loose mb-10 text-center">{q.question}</h2>

      <Controller
        name={fieldName}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="w-full mb-10">
            <Textarea
              {...field}
              // Cast field.value to string to resolve the [string | null, ...] mismatch
              value={(field.value as string) ?? ""}
              placeholder="Enter your answer..."
              className="min-h-[120px]"
            />
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
          onClick={backHandler}
        >
          Back
        </Button>

        <div className="flex items-center gap-2">
          <Button
            disabled={
              form.formState.isSubmitting || value !== "" || value !== null
            }
            onClick={nextHandler}
            className="font-bold rounded-full px-8"
          >
            {form.formState.isSubmitting ? (
              <div className="flex items-center gap-2">
                <LoaderCircle className="animate-spin" />
                <span>Saving...</span>
              </div>
            ) : index < 2 ? (
              "Next Question"
            ) : (
              "Finish Interview"
            )}
          </Button>

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
