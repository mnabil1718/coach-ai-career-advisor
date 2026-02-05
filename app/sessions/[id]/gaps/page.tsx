import { Gaps } from "@/components/gaps/gaps";
import { ParseResumeSchema } from "@/schema/resume.schema";
import { getCVReview } from "@/services/cv_reviews/reviews.service";
import { getUserResumes } from "@/services/resume/resume.service";
import { getSession } from "@/services/sessions/sessions.service";

export default async function SkillGapsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: resumes } = await getUserResumes();

  const { data: session } = await getSession(id);

  const { data: review } = await getCVReview(session!.id);

  const parsed = ParseResumeSchema.safeParse(review!.parsed_content);

  if (!parsed.success) {
    throw new Error("parse in review failed");
  }

  return (
    <div className="w-full flex-1 flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col gap-2 items-center">
        <Gaps
          resume={resumes?.[0]}
          sessionId={id}
          skills={parsed.data.skills}
        />
      </div>
    </div>
  );
}
