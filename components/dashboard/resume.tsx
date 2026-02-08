"use client";

import { Resume as ResumeType } from "@/types/resume.type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { EllipsisVertical, ExternalLink, RefreshCw } from "lucide-react";

import { UploadDialog } from "../upload-dialog";
import { getSignedURL } from "@/services/storage/storage.service";
import { SUPABASE_UPLOADS_BUCKET } from "@/constants/file";

export function Resume({ resume }: { resume: ResumeType }) {
  const previewHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const { data: url } = await getSignedURL(
      SUPABASE_UPLOADS_BUCKET,
      resume.path,
    );
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="p-3 rounded-lg ring-2 border w-full text-sm font-medium flex items-center justify-between">
      {resume.name}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"}>
            <EllipsisVertical />{" "}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={previewHandler}>
              <ExternalLink /> See Preview
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <UploadDialog>
                <RefreshCw /> Replace
              </UploadDialog>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
