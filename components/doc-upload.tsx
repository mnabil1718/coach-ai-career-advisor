"use client";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/dropzone";
import { MAX_FILE_SIZE_LIMIT } from "@/constants/file";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import { postResume } from "@/services/resume/resume.service";
import { useRouter } from "next/navigation";

export type DocUploadProps = {
  path: string;
};

export function DocUpload({ path }: DocUploadProps) {
  const router = useRouter();
  const props = useSupabaseUpload({
    bucketName: "uploads",
    path,
    allowedMimeTypes: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxFiles: 1,
    maxFileSize: MAX_FILE_SIZE_LIMIT,
    onSuccess: async (files) => {
      await postResume(files[0].name, files[0].fullPath);
      router.refresh();
    },
  });

  return (
    <Dropzone {...props}>
      <DropzoneEmptyState />
      <DropzoneContent />
    </Dropzone>
  );
}
