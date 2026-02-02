"use client";

import { Button } from "@/components/ui/button";
import { toastError } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    toastError(error.message || "Something went wrong");
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-6 flex-1">
      <p className="text-sm text-muted-foreground mb-4">
        Something went wrong while loading this section.
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant={"outline"}
          className="rounded-full"
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Button
          variant={"outline"}
          className="rounded-full"
          onClick={() => reset()}
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
