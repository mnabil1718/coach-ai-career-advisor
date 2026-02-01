import { Suspense } from "react";
import { Greeting } from "@/components/greeting";
import { ResumeList } from "@/components/dashboard/resume-list";

export default function Dashboard() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex flex-col gap-2 items-center">
        <Suspense>
          <Greeting />
        </Suspense>

        <ResumeList />
      </div>
    </div>
  );
}
