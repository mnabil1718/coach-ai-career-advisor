import { MockInterview } from "@/components/interview/mock-interview";
import { AnalysisSchema } from "@/schema/analysis.schema";
import { getCVReview } from "@/services/cv_reviews/reviews.service";
import { getSession } from "@/services/sessions/sessions.service";

export default async function MockPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: session } = await getSession(id);
  const { data: review } = await getCVReview(session!.id);

  const parsed = AnalysisSchema.safeParse(review!.review);

  if (!parsed.success) {
    throw new Error("parse in review failed");
  }

  return (
    <div className="w-full flex-1 flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col gap-2 items-center">
        <MockInterview
          sessionId={session!.id}
          parsedCVData={review!.parsed_content}
        />
      </div>
    </div>
  );
}
