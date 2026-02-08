"use client";

import { useState } from "react";
import { PrimaryButton } from "../primary-button";
import { toastError, toastLoading, toastSuccess } from "@/utils/toast";
import { downloadFile } from "@/services/storage/storage.service";
import { SUPABASE_UPLOADS_BUCKET } from "@/constants/file";
import { Resume } from "@/types/resume.type";
import { parseFromArrayBuffer } from "@/services/processing/parser.service.";
import { formatParse } from "@/services/llm/format-parse.service";
import { createSession } from "@/services/sessions/sessions.service";
import { createCVReview } from "@/services/cv_reviews/reviews.service";
import { useRouter } from "next/navigation";

const TOAST_PARSING_ID = "parsing";

export function Parse({ resume }: { resume: Resume | undefined }) {
  const router = useRouter();
  const [loadMsg, setLoadMsg] = useState<string>("");

  const parse = async () => {
    if (!resume) {
      toastError("No resume found");
      return;
    }

    setLoadMsg("parsing...");
    toastLoading("Parsing document...", undefined, TOAST_PARSING_ID);
    const { data: blob } = await downloadFile(
      SUPABASE_UPLOADS_BUCKET,
      resume.path,
    );
    const { data: txt } = await parseFromArrayBuffer(blob!);

    setLoadMsg("formatting...");
    toastLoading("Generating Response...", undefined, TOAST_PARSING_ID, true);
    const { data: json } = await formatParse(txt!);

    const { data: session } = await createSession();
    await createCVReview({
      session_id: session!.id,
      resume_id: resume.id,
      parsed_content: json!,
    });

    setLoadMsg("");

    toastSuccess("Parsing finished", undefined, TOAST_PARSING_ID);

    router.push(`/sessions/${session!.id}/verify`);
  };

  return (
    <PrimaryButton
      text="Start new session"
      loading={loadMsg !== ""}
      loadingText={loadMsg}
      disabled={!resume || loadMsg !== ""}
      onClick={parse}
    />
  );
}
