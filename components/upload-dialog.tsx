"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Upload, UploadConfigOptions } from "./upload";
import { postResume } from "@/services/resume/resume.service";
import { MAX_FILE_SIZE_LIMIT, SUPABASE_UPLOADS_BUCKET } from "@/constants/file";
import { Button } from "./ui/button";
import { useAuthContext } from "@/context/auth-context";
import { useState } from "react";
import { toastError } from "@/utils/toast";

export function UploadDialog({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuthContext();
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const config: UploadConfigOptions = {
    allowedMimeTypes: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    onSuccess: (files) => {
      setFileName(files[0].name);
      setFilePath(files[0].fullPath);
    },
    path: `resumes/${user.sub}`,
    maxFiles: 1,
    maxFileSize: MAX_FILE_SIZE_LIMIT,
    bucketName: SUPABASE_UPLOADS_BUCKET,
  };

  const save = async () => {
    if (!fileName || !filePath) {
      toastError("File not uploaded properly");
      return;
    }

    await postResume(fileName, filePath);
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center gap-2">
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload New File</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Upload config={config} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"ghost"} className="rounded-full">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={save}
            disabled={!fileName || !filePath}
            className="font-bold rounded-full"
          >
            Update Resume
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
