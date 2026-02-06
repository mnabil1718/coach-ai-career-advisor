import { LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Interview } from "@/types/interview.type";
import { useState } from "react";
import { generateOverallFeedback } from "@/services/llm/interview.service";
import { toastLoading, toastSuccess } from "@/utils/toast";
import { useRouter } from "next/navigation";

const TOAST_ID = "finish:interview";

export function FinishInterviewButton({ interview }: { interview: Interview }) {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const submit = async () => {
    setLoading(true);
    toastLoading(
      "generating your overall performance...",
      undefined,
      TOAST_ID,
      true,
    );

    await generateOverallFeedback(interview.id);

    toastSuccess("Your interview result is ready", undefined, TOAST_ID);

    setLoading(false);

    router.push(
      `/sessions/${interview.session_id}/mock/${interview.id}/result`,
    );
  };

  return (
    <Button
      disabled={loading}
      onClick={submit}
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
