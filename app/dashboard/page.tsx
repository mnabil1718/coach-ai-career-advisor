import { Suspense } from "react";
import { Greeting } from "@/components/greeting";
import { DocUpload } from "@/components/doc-upload";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex flex-col gap-2 items-center">
        <Suspense>
          <Greeting />
        </Suspense>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>3 Steps to Career Success</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="relative flex flex-col">
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 flex justify-center items-center bg-foreground text-background rounded-full font-medium text-sm flex-none">
                  1
                </div>{" "}
                <span>Upload CV - Get feedback</span>
              </li>
              <li className="border-r-2 w-3.5 h-6"></li>
              <li className="flex items-center gap-3 opacity-60">
                <div className="w-7 h-7 flex justify-center items-center bg-foreground text-background rounded-full font-medium text-sm flex-none">
                  2
                </div>{" "}
                <span>Practice mock interview</span>
              </li>
              <li className="border-r-2 w-3.5 h-6"></li>
              <li className="flex items-center gap-3 opacity-60">
                <div className="w-7 h-7 flex justify-center items-center bg-foreground text-background rounded-full font-medium text-sm flex-none">
                  3
                </div>{" "}
                <span>Identify skill gaps</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <p className="mb-2 text-muted-foreground">
          Let &apos; s start by uploading your CV below
        </p>
        <DocUpload />
      </div>
    </div>
  );
}
