import { getUserResumes } from "@/services/resume/resume.service";
import Image from "next/image";
import Empty from "../../public/empty-docs.svg";
import { DocUpload } from "../doc-upload";
import { getCurrentUser } from "@/services/auth/user.service";
import { ResumeSelection } from "./resume-selection";

export async function ResumeList() {
  const { data: user } = await getCurrentUser();
  const { data: resumes } = await getUserResumes();

  if (resumes!.length === 0) {
    return (
      <div className="w-full flex flex-col p-5 border rounded-lg border-border/30 items-center">
        <Image
          src={Empty}
          alt="No document illustration"
          width={64}
          className="mb-3 opacity-80"
        />
        <h2 className="text-muted-foreground mb-6">
          You have no uploaded CV. Start uploading below.
        </h2>
        <DocUpload path={`resumes/${user?.sub}`} />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col p-5 items-center">
      <ResumeSelection resumes={resumes!} />
    </div>
  );
}
