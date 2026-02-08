"use client";

import { StartInterviewFormSchema } from "@/schema/interview.schema";
import { StartInterviewFormSchemaType } from "@/types/interview.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRouter, usePathname } from "next/navigation";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Required } from "../form/required-span";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PrimaryButton } from "../primary-button";
import { toastLoading, toastSuccess } from "@/utils/toast";
import {
  createInterview,
  insertQAs,
} from "@/services/interview/interview.service";
import { generateQuestions } from "@/services/llm/interview.service";
import { ParseResumeSchemaType } from "@/schema/resume.schema";

const TOAST_ID = "mock:start";

export type MockStarterProps = {
  sessionId: string;
  parsedCV: ParseResumeSchemaType;
};

export function MockStarter({ sessionId, parsedCV }: MockStarterProps) {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<StartInterviewFormSchemaType>({
    resolver: zodResolver(StartInterviewFormSchema),
    mode: "onChange",
    defaultValues: {
      target_role: "",
      target_role_level: "junior",
    },
  });

  const validate = async () => {
    const isValid = await form.trigger();

    if (!isValid) return;
  };

  const start = async () => {
    await validate();

    toastLoading("Generating questions...", undefined, TOAST_ID, true);

    const target_role = form.getValues("target_role");
    const target_role_level = form.getValues("target_role_level");
    const { data: itv } = await createInterview(
      sessionId,
      target_role,
      target_role_level,
    );

    const { data: questions } = await generateQuestions(
      target_role,
      target_role_level,
      parsedCV,
    );

    await insertQAs(itv!.id, questions!);

    toastSuccess("Questions generated", undefined, TOAST_ID);

    // redirect current with query string
    const params = new URLSearchParams();
    params.set("interviewId", itv!.id);
    params.set("step", "1");

    router.push(`${pathname}?${params.toString()}`);
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
