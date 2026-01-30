"use client";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/dropzone";
import { MAX_FILE_SIZE_LIMIT } from "@/constants/file";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import { formatParse } from "@/services/llm/format-parse.service";
import { parseFromArrayBuffer } from "@/services/processing/parser.service.";
import { toastError, toastLoading, toastSuccess } from "@/utils/toast";

const TOAST_ID = "upload";

export function DocUpload() {
  const props = useSupabaseUpload({
    bucketName: "uploads",
    path: "",
    allowedMimeTypes: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxFiles: 1,
    maxFileSize: MAX_FILE_SIZE_LIMIT,
    onSuccess: async (files) => {
      toastLoading("Parsing CV...", "bottom-right", TOAST_ID);
      const { data: txt, error } = await parseFromArrayBuffer(files[0].file);

      if (error) {
        toastError(error, "bottom-right", TOAST_ID);
        return;
      }

      console.log("PARSE: ", txt);

      toastLoading("Generating Response...", "bottom-right", TOAST_ID, true);
      const { data, error: berror } = await formatParse(txt!);
      if (berror) {
        toastError(berror, "bottom-right", TOAST_ID);
        return;
      }

      console.log("GENERATED: ", data);
      toastSuccess("Your response are ready!", "bottom-right", TOAST_ID);
    },
  });

  return (
    <Dropzone {...props}>
      <DropzoneEmptyState />
      <DropzoneContent />
    </Dropzone>
  );
}
