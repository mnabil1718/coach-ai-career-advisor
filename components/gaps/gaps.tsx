"use client";

import { Input } from "../ui/input";
import { Field, FieldError, FieldLabel } from "../ui/field";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { Resume } from "@/types/resume.type";
import { SelectedResume } from "../selected-resume";
import { GapsFormSchemaType, SkillsSchemaType } from "@/types/gaps.type";
import { GapsFormSchema } from "@/schema/gaps.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Required } from "../form/required-span";
import { getSignedURL } from "@/services/storage/storage.service";
import { SUPABASE_BUCKET_NAME } from "@/constants/file";
import { PrimaryButton } from "../primary-button";
import { useState } from "react";
import { X } from "lucide-react";
import { GapsContextProvider, useGapsContext } from "@/context/gaps-context";
import { Button } from "../ui/button";

type GapsProps = {
  resume: Resume | undefined;
  sessionId: string;
  skills: SkillsSchemaType;
};

export function Gaps(props: GapsProps) {
  if (!props.resume) throw new Error("No resume found");

  const form = useForm<GapsFormSchemaType>({
    resolver: zodResolver(GapsFormSchema),
    mode: "onSubmit",
    defaultValues: {
      target_role: "",
      skills: props.skills,
    },
  });

  return (
    <GapsContextProvider sessionId={props.sessionId} resume={props.resume}>
      <FormProvider {...form}>
        <GapsInner />
      </FormProvider>
    </GapsContextProvider>
  );
}

function GapsInner() {
  const form = useFormContext<GapsFormSchemaType>();
  const { step, startProcessor } = useGapsContext();

  return (
    <div className="w-full">
      <div className="max-w-md mx-auto">
        <form id="gaps-form" onSubmit={form.handleSubmit(startProcessor)}>
          <header className="my-12 text-center">
            <h1 className="text-xl font-medium mb-2">Skill Gaps Analysis</h1>
          </header>

          {step === 1 ? <StarterGapsScreen /> : <SuccessorGapsScreen />}
        </form>
      </div>
    </div>
  );
}

function StarterGapsScreen() {
  const { setStep, loading, resume } = useGapsContext();
  const form = useFormContext<GapsFormSchemaType>();

  const previewHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { data: url } = await getSignedURL(SUPABASE_BUCKET_NAME, resume.path);

    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const next = async () => {
    const valid = await form.trigger();
    if (!valid) return;

    setStep(2);
  };

  return (
    <div>
      <Controller
        name="target_role"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="mb-6">
            <FieldLabel htmlFor="target_role" className="gap-1">
              Target Role
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

      <Field className="mb-6">
        <FieldLabel className="gap-1">Saved Resume</FieldLabel>
        <SelectedResume
          resume_title={resume.name}
          previewHandler={previewHandler}
        />
      </Field>
      <div className="flex w-full justify-center mt-6">
        <PrimaryButton
          type="button"
          text="Start Analysis"
          onClick={next}
          loading={loading}
        />
      </div>
    </div>
  );
}

function SuccessorGapsScreen() {
  const { setStep, loading } = useGapsContext();
  const form = useFormContext<GapsFormSchemaType>();
  const [inputValue, setInputValue] = useState("");

  return (
    <div>
      <Controller
        name="skills"
        control={form.control}
        render={({ field }) => {
          const skills = field.value || [];

          const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const trimmed = inputValue.trim();

              if (trimmed && !skills.includes(trimmed)) {
                field.onChange([...skills, trimmed]);
                setInputValue("");
              }
            } else if (
              e.key === "Backspace" &&
              !inputValue &&
              skills.length > 0
            ) {
              field.onChange(skills.slice(0, -1));
            }
          };

          const removeSkill = (index: number) => {
            field.onChange(skills.filter((_, i) => i !== index));
          };

          return (
            <Field className="col-span-2">
              <FieldLabel>Skills</FieldLabel>

              <div className="flex flex-wrap gap-2 p-1.5 min-h-[42px] w-full rounded-md border border-input bg-background text-sm focus-within:ring-1 focus-within:ring-ring">
                {skills.map((skill, index) => (
                  <div
                    key={`${skill}-${index}`}
                    className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-accent/30 rounded-md"
                  >
                    <span className="text-xs font-medium">{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="hover:bg-accent p-0.5 rounded-sm"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    skills.length === 0 ? "Type skill and press Enter..." : ""
                  }
                  className="flex-1 bg-transparent outline-none min-w-[140px] px-1 py-1"
                />
              </div>

              <span className="text-sm text-muted-foreground mt-2 px-1">
                Press{" "}
                <pre className="inline-block bg-accent/30 px-2 py-1 rounded mx-1 text-xs">
                  Enter
                </pre>{" "}
                to add new skill.
              </span>
            </Field>
          );
        }}
      />
      <div className="flex w-full justify-between mt-6">
        <Button
          variant={"ghost"}
          onClick={() => setStep(1)}
          className="rounded-full"
        >
          Back
        </Button>
        <PrimaryButton
          type="submit"
          text="Generate Feedback"
          loading={loading}
        />
      </div>
    </div>
  );
}
