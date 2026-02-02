import { TooltipHover } from "./tooltip-hover";
import { ChevronDown, ChevronUp } from "lucide-react";

export function CollapseButton({ open }: { open: boolean }) {
  return (
    <TooltipHover content={`${open ? "Collapse" : "Expand"} section`}>
      {open ? (
        <ChevronUp className="size-4" />
      ) : (
        <ChevronDown className="size-4" />
      )}
    </TooltipHover>
  );
}
