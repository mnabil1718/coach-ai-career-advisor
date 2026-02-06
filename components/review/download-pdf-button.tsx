"use client";

import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "../ui/button";
import { ArrowDownToLine } from "lucide-react";

export function DownloadPDFButton({
  filename,
  document,
  buttonText = "Download PDF",
}: {
  filename: string;
  // Use ReactElement instead of ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  document: React.ReactElement<any>;
  buttonText?: string;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient)
    return (
      <Button variant="outline" disabled className="rounded-full font-semibold">
        Initializing...
      </Button>
    );

  return (
    <PDFDownloadLink document={document} fileName={filename}>
      {({ loading }) => (
        <Button
          variant={"outline"}
          disabled={loading}
          className="rounded-full font-semibold"
        >
          {loading ? (
            "Generating..."
          ) : (
            <div className="flex items-center gap-2">
              <ArrowDownToLine className="size-4" />
              <span>{buttonText}</span>
            </div>
          )}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
