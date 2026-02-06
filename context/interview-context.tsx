import { Json } from "@/database.types";
import { useInterview } from "@/hooks/use-interview";

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
  step,
}: {
  children: React.ReactNode;
  sessionId: string;
  parsedCV: Json;
  step: number;
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
  const interview = useInterview(form, sessionId, parsedCV, step);

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
