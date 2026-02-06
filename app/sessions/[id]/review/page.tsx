import { DownloadPDFButton } from "@/components/review/download-pdf-button";
import { CVChecklistPDF } from "@/components/review/pdf-checklist";
import { ReviewReport } from "@/components/review/review-report";
import { Button } from "@/components/ui/button";
import { AnalysisSchema, AnalysisSchemaType } from "@/schema/analysis.schema";
import { getCVReview } from "@/services/cv_reviews/reviews.service";
import { getSession } from "@/services/sessions/sessions.service";
import { validateData } from "@/utils/parse";
import Link from "next/link";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: session } = await getSession(id);
  const { data: review } = await getCVReview(session!.id);

  const parsed = validateData<AnalysisSchemaType>(
    AnalysisSchema,
    review!.review,
  );

  return (
    <div className="w-full flex-1 flex flex-col items-center">
      <div className="w-full max-w-4xl flex flex-col gap-2 items-center">
        <div className="mt-6 w-full flex justify-end">
          <DownloadPDFButton
            filename="CV_Checklist_Report.pdf"
            document={<CVChecklistPDF data={parsed} />}
            buttonText="Download Report"
          />
        </div>
        <header className="mt-6 mb-6 text-center">
          <h1 className="text-xl font-medium mb-2">CV Analysis Report</h1>
        </header>
        <ReviewReport review={parsed} />

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
