import { VerifyForm } from "@/components/verify-form";
import { getCVReview } from "@/services/cv_reviews/reviews.service";
import { getSession } from "@/services/sessions/sessions.service";

export default async function VerifySessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: session } = await getSession(id);
  const { data: review } = await getCVReview(session!.id);

  return (
    <div className="w-full flex-1 flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col gap-2 items-center">
        <VerifyForm initData={review!} session_id={session!.id} />
      </div>
    </div>
  );
}
