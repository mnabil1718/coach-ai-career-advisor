"use client";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Resume } from "@/types/resume.type";
import { LoaderCircle } from "lucide-react";

import { downloadFile, getSignedURL } from "@/services/storage/storage.service";
import { SUPABASE_BUCKET_NAME } from "@/constants/file";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";
import { toastLoading, toastSuccess } from "@/utils/toast";
import { parseFromArrayBuffer } from "@/services/processing/parser.service.";
import { formatParse } from "@/services/llm/format-parse.service";
import { createSession } from "@/services/sessions/sessions.service";
import { createCVReview } from "@/services/cv_reviews/reviews.service";
import { useRouter } from "next/navigation";
import { SelectedResume } from "../selected-resume";

export function ResumeSelection({ resumes }: { resumes: Resume[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Resume>(resumes[0]);
  const [loadmsg, setLoadMsg] = useState<string | null>(null); // loading with status

  const previewHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { data: url } = await getSignedURL(
      SUPABASE_BUCKET_NAME,
      selected.path,
    );
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const selectedChangeHandler = (r: Resume) => {
    if (r.id === selected.id) return;

    setSelected(r);
  };

  const TOAST_PARSING_ID = "parsing";

  const parseHandler = async () => {
    setLoadMsg("parsing...");
    toastLoading("Parsing document...", undefined, TOAST_PARSING_ID);
    const { data: blob } = await downloadFile(
      SUPABASE_BUCKET_NAME,
      selected.path,
    );
    const { data: txt } = await parseFromArrayBuffer(blob!);

    setLoadMsg("formatting...");
    toastLoading("Generating Response...", undefined, TOAST_PARSING_ID, true);
    const { data: json } = await formatParse(txt!);

    const { data: session } = await createSession();
    await createCVReview({
      session_id: session!.id,
      resume_id: selected.id,
      parsed_content: json!,
    });

    router.push(`/sessions/${session!.id}/verify`);

    toastSuccess("Parsing finished", undefined, TOAST_PARSING_ID);
  };

  return (
    <>
      <SelectionDialog
        resumes={resumes}
        selected={selected}
        previewHandler={previewHandler}
        selectedChangeHandler={selectedChangeHandler}
      />
      <Button
        disabled={!!loadmsg}
        onClick={parseHandler}
        className="px-5 py-5 rounded-full font-bold mt-4"
      >
        {!loadmsg ? "Parse CV" : <ParseLoad loadmsg={loadmsg} />}
      </Button>
    </>
  );
}

function ParseLoad({ loadmsg }: { loadmsg: string }) {
  return (
    <div className="flex items-center gap-2">
      <LoaderCircle className="animate-spin opacity-80" />{" "}
      <span>{loadmsg}</span>
    </div>
  );
}

export function SelectionDialog({
  resumes,
  selected,
  previewHandler,
  selectedChangeHandler,
}: {
  resumes: Resume[];
  selected: Resume;
  previewHandler: (e: React.MouseEvent<HTMLButtonElement>) => void;
  selectedChangeHandler: (r: Resume) => void;
}) {
  return (
    <Dialog>
      <div className="flex w-full justify-end">
        <DialogTrigger asChild>
          <Button variant={"ghost"} className="rounded-full mb-2">
            Select other CV
          </Button>
        </DialogTrigger>
      </div>
      <DialogTrigger asChild>
        <SelectedResume
          resume_title={selected.name}
          previewHandler={previewHandler}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select CV</DialogTitle>
          <DialogDescription>
            Select your saved CV for our AI Coach to analyze
          </DialogDescription>
        </DialogHeader>
        <ul className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto p-4 flex flex-col gap-3">
          {resumes.map((r, index) => (
            <li
              key={index}
              onClick={() => selectedChangeHandler(r)}
              className={cn(
                r.id === selected.id ? "ring-2" : "",
                "w-full p-5 rounded-lg border text-sm font-medium flex items-center gap-3 cursor-pointer",
              )}
            >
              {r.name}
            </li>
          ))}
        </ul>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
