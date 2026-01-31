import { APP_NAME } from "@/constants/brand";
import { cn } from "@/lib/utils";
import Link from "next/link";

export type BrandTextSize =
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl";

export function Brand({
  url = "/",
  name = APP_NAME,
  size = "lg",
  className = "",
}: {
  url?: string;
  name?: string;
  size?: BrandTextSize;
  className?: string;
}) {
  return (
    <Link href={url}>
      <h1 className={cn("font-bold", `text-${size}`, className)}>{name}</h1>
    </Link>
  );
}
