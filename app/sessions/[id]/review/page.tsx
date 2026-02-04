import { ReviewReport } from "@/components/review/review-report";
import { Button } from "@/components/ui/button";
import { AnalysisSchema } from "@/schema/analysis.schema";
import { getCVReview } from "@/services/cv_reviews/reviews.service";
import { getSession } from "@/services/sessions/sessions.service";
import Link from "next/link";

export default async function ReviewPage({
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
        <header className="mt-12 mb-6 text-center">
          <h1 className="text-xl font-medium mb-2">CV Analysis Report</h1>
        </header>
        <ReviewReport review={parsed.data} />

        <div className="w-full flex items-center justify-between">
          <Link href={`/sessions/${session?.id}/verify`}>
            <Button variant={"ghost"}>Back</Button>
          </Link>
          <Link href={`/sessions/${session?.id}/mock`}>
            <Button className="font-semibold">Next: Mock interview</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
