import { Suspense } from "react";
import { Greeting } from "@/components/greeting";
import { DocUpload } from "@/components/doc-upload";

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex flex-col gap-2 items-center">
        <Suspense>
          <Greeting />
        </Suspense>
        <p className="mb-2 text-muted-foreground">
          Let &apos; s start by uploading your CV below
        </p>
        <DocUpload />
      </div>
    </div>
  );
}
