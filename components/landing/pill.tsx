import { Sparkles } from "lucide-react";

export function Pill() {
  return (
    <span className="text-sm py-2 px-4 rounded-full bg-accent/30 backdrop-blur-lg border border-white/10 flex items-center gap-2 font-medium mb-5">
      <Sparkles strokeWidth={1.5} className="size-4 text-purple-400" />
      AI-Powered Career Growth
    </span>
  );
}
