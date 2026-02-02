import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export function getBadgeVariant(priority: string) {
  if (priority === "HIGH") {
    return "bg-destructive text-background hover:bg-destructive hover:text-background";
  }

  if (priority === "MEDIUM") {
    return "bg-chart-4 text-foreground hover:bg-chart-4 hover:text-foreground";
  }

  return "bg-chart-5/20 text-muted-foreground hover:bg-chart-5/20 hover:text-muted-foreground";
}

export function ReviewBadge({ priority }: { priority: string }) {
  return (
    <Badge className={cn(getBadgeVariant(priority), "px-1.5 py-1")}>
      {priority} PRIORITY
    </Badge>
  );
}
