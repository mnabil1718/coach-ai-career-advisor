import { Suspense } from "react";
import { Greeting } from "@/components/greeting";
import { ResumeList } from "@/components/dashboard/resume-list";

export default function Dashboard() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12 items-center">
      <div className="flex flex-col gap-2 items-center">
        <Suspense>
          <div className="mb-2 mt-12">
            <Greeting />
          </div>
        </Suspense>

        <div className="max-w-2xl w-full">
          <ResumeList />
        </div>
      </div>
    </div>
  );
}
