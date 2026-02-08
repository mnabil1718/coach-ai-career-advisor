import { Suspense } from "react";
import { Greeting } from "@/components/greeting";
import { getUserResumes } from "@/services/resume/resume.service";
import { UploadResume } from "@/components/dashboard/upload-resume";

import { Resume } from "@/components/dashboard/resume";
import { getCurrentUser } from "@/services/auth/user.service";
import { AuthContextProvider } from "@/context/auth-context";

import { Parse } from "@/components/dashboard/parse";
import { SessionHistory } from "@/components/dashboard/session-history";

export default async function Dashboard() {
  const { data: user } = await getCurrentUser();

  if (!user) throw new Error("Action not allowed");

  const { data: resumes } = await getUserResumes();

  const renderResume = (): React.ReactNode => {
    if (resumes && resumes.length > 0) {
      return <Resume resume={resumes[0]} />;
    }

    return <UploadResume />;
  };

  return (
    <AuthContextProvider user={user}>
      <div className="flex-1 w-full flex flex-col gap-12 items-center">
        <div className="flex max-w-sm w-full flex-col gap-5 items-center mt-12">
          <Suspense>
            <div className="text-center">
              <Greeting />
              <p className="mt-2 text-muted-foreground text-sm">
                Start a session to get feedback on your resume, do mock
                interview, and analyze skill gaps using our AI tool for free.
              </p>
            </div>
          </Suspense>

          <div className="w-full">{renderResume()}</div>
          <Parse resume={resumes?.[0]} />

          <div className="w-full mt-10">
            <SessionHistory />
          </div>
        </div>
      </div>
    </AuthContextProvider>
  );
}
