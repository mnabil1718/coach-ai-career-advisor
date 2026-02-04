import { Json } from "@/database.types";
import { useInterview } from "@/hooks/use-interview";
import { InterviewFormSchema } from "@/schema/interview.schema";
import { InterviewFormSchemaType } from "@/types/interview.type";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { createContext, useContext } from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";

type InterviewContextType = ReturnType<typeof useInterview> & {
  form: UseFormReturn<InterviewFormSchemaType>;
};
const InterviewContext = createContext<InterviewContextType | undefined>(
  undefined,
);

export const InterviewProvider = ({
  children,
  sessionId,
  parsedCV,
}: {
  children: React.ReactNode;
  sessionId: string;
  parsedCV: Json;
}) => {
  const form = useForm<InterviewFormSchemaType>({
    resolver: zodResolver(InterviewFormSchema),
    mode: "onChange",
    defaultValues: {
      target_role: "",
      target_role_level: "junior",
      answers: [null, null, null],
    },
  });
  const interview = useInterview(form, sessionId, parsedCV);

  return (
    <InterviewContext.Provider value={{ ...interview, form }}>
      <FormProvider {...form}>{children}</FormProvider>
    </InterviewContext.Provider>
  );
};

export const useInterviewContext = () => {
  const ctx = useContext(InterviewContext);
  if (!ctx) {
    throw new Error(
      "useInterviewContext must be used within an InterviewProvider",
    );
  }

  return ctx;
};
