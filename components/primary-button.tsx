import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";

export type PrimaryButtonProps = {
  text: string;
  type?: ButtonType;
  loading?: boolean;
  loadingText?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
};

export type ButtonType = "button" | "submit" | "reset" | undefined;

export function PrimaryButton({
  text,
  className,
  type = "button",
  loading = false,
  loadingText = "Processing...",
  disabled = false,
  onClick = () => {},
}: PrimaryButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={cn(className, "font-bold rounded-full")}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <LoaderCircle className="animate-spin" />
          <span>{loadingText}</span>
        </div>
      ) : (
        <>{text}</>
      )}
    </Button>
  );
}
