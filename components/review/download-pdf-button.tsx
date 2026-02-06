"use client";

import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { CVChecklistPDF } from "./pdf-checklist";
import { Button } from "../ui/button";
import { AnalysisSchemaType } from "@/schema/analysis.schema";
import { ArrowDownToLine } from "lucide-react";

export function DownloadPDFButton({ data }: { data: AnalysisSchemaType }) {
  const [isClient, setIsClient] = useState(false);

  // This ensures the component only renders after the first mount (client-side)
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <Button disabled>Loading PDF Generator...</Button>;

  return (
    <PDFDownloadLink
      document={<CVChecklistPDF data={data} />}
      fileName="CV_Improvement_Checklist.pdf"
    >
      {({ loading }) => (
        <Button variant={"outline"} disabled={loading} className="rounded-full">
          {loading ? (
            "Generating..."
          ) : (
            <div className="flex items-center gap-2">
              <ArrowDownToLine /> <span>Download Checklist PDF</span>
            </div>
          )}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
