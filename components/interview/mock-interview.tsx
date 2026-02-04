"use client";

import { Input } from "../ui/input";
import { AnswerFormKey, InterviewFormSchemaType } from "@/types/interview.type";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Button } from "../ui/button";
import { Controller, useFormContext } from "react-hook-form";
import { Required } from "../form/required-span";
import { Json } from "@/database.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { LoaderCircle } from "lucide-react";
import { Textarea } from "../ui/textarea";

import {
  InterviewProvider,
  useInterviewContext,
} from "@/context/interview-context";

type MockInterviewProps = {
  sessionId: string;
  parsedCVData: Json;
};

export function MockInterview({ sessionId, parsedCVData }: MockInterviewProps) {
  return (
    <InterviewProvider sessionId={sessionId} parsedCV={parsedCVData}>
      <div className="w-full">
        <div className="max-w-md mx-auto">
          <StepDecider />
        </div>
      </div>
    </InterviewProvider>
  );
}

function StepDecider(): React.ReactNode {
  const { step } = useInterviewContext();

  switch (step) {
    case 0:
      return <RoleInput />;

    case 1:
      return <QA index={0} />;

    case 2:
      return <QA index={1} />;

    case 3:
      return <QA index={2} />;

    default:
      return <RoleInput />;
  }
}

function RoleInput() {
  const form = useFormContext<InterviewFormSchemaType>();
  const { loading, startProcessor } = useInterviewContext();

  const startHandler = async () => {
    const valid = await form.trigger();

    if (!valid) return;

    startProcessor();
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

function QA({ index }: { index: number }) {
  const form = useFormContext<InterviewFormSchemaType>();
  const { loading, nextProcessor, backProcessor, questions } =
    useInterviewContext();

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

  return (
    <div>
      <div className="flex flex-col w-full items-center">
        <QBadge type={questions.questions[index].type} />
        <span className="text-sm text-muted-foreground mb-6">
          Question {index + 1}/3
        </span>
      </div>

      <h2 className="text-lg leading-loose mb-10 text-center">
        {questions.questions[index].question}
      </h2>

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
          onClick={backProcessor}
        >
          Back
        </Button>

        <div className="flex items-center gap-2">
          <Button
            disabled={
              form.formState.isSubmitting || !form.formState.isValid || loading
            }
            onClick={nextHandler}
            className="font-bold rounded-full px-8"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <LoaderCircle className="animate-spin" />
                <span>Analyzing...</span>
              </div>
            ) : (
              "Submit"
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
