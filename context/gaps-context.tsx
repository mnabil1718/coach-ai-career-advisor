import { getCurrentUser } from "@/services/auth/user.service";
import {
  createSkillGaps,
  saveSkillGapsResult,
} from "@/services/gaps/gaps.service";
import { analyzeSkillGaps } from "@/services/llm/skill-gap.service";
import { GapsFormSchemaType } from "@/types/gaps.type";
import { Resume } from "@/types/resume.type";
import { toastLoading, toastSuccess } from "@/utils/toast";
import { useRouter } from "next/navigation";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

export type GapsContextType = {
  step: number;
  resume: Resume;
  loading: boolean;
  setStep: Dispatch<SetStateAction<number>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  startProcessor: (data: GapsFormSchemaType) => void;
};

const GapsContext = createContext<GapsContextType | undefined>(undefined);

const TOAST_ID = "skillgaping";

export const GapsContextProvider = ({
  sessionId,
  resume,
  children,
}: {
  resume: Resume;
  sessionId: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const startProcessor = async (data: GapsFormSchemaType) => {
    setLoading(true);
    toastLoading("Generating feedback...", undefined, TOAST_ID);

    const { data: user } = await getCurrentUser();

    console.log("PAST TOAST", sessionId, resume.id, user!);
    const { data: gap } = await createSkillGaps(
      sessionId,
      resume.id,
      data.target_role,
      data.skills ?? [],
    );

    console.log("PAST CREATE");
    // TODO: generate AI
    const { data: analysis } = await analyzeSkillGaps(
      data.target_role,
      data.skills ?? [],
    );

    console.log("PAST AI");
    // TODO: save result to table back
    await saveSkillGapsResult(gap!.id, analysis!);

    console.log(analysis);

    toastSuccess("Feedback generated successfully", undefined, TOAST_ID);
    setLoading(false);
    // TODO: route push to result url
    router.push(`/sessions/${sessionId}/gaps/${gap!.id}/result`);
  };

  const value: GapsContextType = {
    step,
    resume,
    loading,
    setStep,
    setLoading,
    startProcessor,
  };

  return <GapsContext.Provider value={value}>{children}</GapsContext.Provider>;
};

export const useGapsContext = () => {
  const context = useContext(GapsContext);

  if (!context) {
    throw new Error("useGapsContext must be used within GapsContextProvider");
  }

  return context;
};
