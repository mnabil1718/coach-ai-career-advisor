import { ExternalLink } from "lucide-react";
import { TooltipHover } from "./tooltip-hover";

export type SelectedResumeProps = {
  resume_title: string;
  previewHandler: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export function SelectedResume({
  resume_title,
  previewHandler,
}: SelectedResumeProps) {
  return (
    <div className="w-full cursor-pointer p-5 rounded-lg border ring-2 text-sm font-medium flex items-center gap-3">
      <span className="flex-1">{resume_title}</span>
      <TooltipHover content="See preview">
        <button onClick={previewHandler}>
          <ExternalLink className="size-5 cursor-pointer" />
        </button>
      </TooltipHover>
    </div>
  );
}
