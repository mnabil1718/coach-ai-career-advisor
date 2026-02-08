"use client";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/dropzone";
import { MAX_FILE_SIZE_LIMIT } from "@/constants/file";
import {
  UploadedFileResult,
  useSupabaseUpload,
} from "@/hooks/use-supabase-upload";

export type UploadConfigOptions = {
  path: string;
  bucketName: string;
  allowedMimeTypes: string[];
  maxFiles: number;
  maxFileSize?: number;
  onSuccess: (files: UploadedFileResult[]) => void;
};

export type UploadProps = {
  config: UploadConfigOptions;
};

export function Upload({
  config: {
    path,
    allowedMimeTypes,
    maxFiles,
    bucketName,
    maxFileSize = MAX_FILE_SIZE_LIMIT,
    onSuccess,
  },
}: UploadProps) {
  const props = useSupabaseUpload({
    bucketName,
    path,
    allowedMimeTypes,
    maxFiles,
    maxFileSize,
    onSuccess,
  });

  return (
    <Dropzone {...props}>
      <DropzoneEmptyState />
      <DropzoneContent />
    </Dropzone>
  );
}
