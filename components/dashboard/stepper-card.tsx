import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StepperCard() {
  return (
    <Card className="mb-8 border-border/50 shadow-none">
      <CardHeader>
        <CardTitle>Improvement Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="relative grid grid-cols-5">
          <li className="flex-1/3 flex flex-col items-center gap-3 text-sm">
            <div className="w-7 h-7 flex justify-center items-center bg-foreground text-background rounded-full font-medium flex-none">
              1
            </div>{" "}
            <p>Upload CV</p>
          </li>
          <li className="border-b-4 h-1/2"></li>
          <li className="flex-1/3 flex flex-col items-center gap-3 text-sm">
            <div className="w-7 h-7 flex justify-center items-center bg-foreground text-background rounded-full font-medium flex-none">
              2
            </div>{" "}
            <p>Practice Mock Interview</p>
          </li>
          <li className="border-b h-1/2"></li>
          <li className="flex-1/3 flex flex-col items-center gap-3 text-sm">
            <div className="w-7 h-7 flex justify-center items-center bg-foreground text-background rounded-full font-medium flex-none">
              3
            </div>{" "}
            <p>Identify Skill Gaps</p>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
