"use client";

import { FeedbackSchemaType } from "@/types/interview.type";
import {
  Check,
  CheckCircle2,
  CircleAlert,
  Copy,
  Lightbulb,
  Star,
  StarHalf,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { TooltipHover } from "../tooltip-hover";
import { useRef, useState } from "react";
import { SummaryChart } from "../summary-chart";

export type FeedbackProps = {
  data: FeedbackSchemaType;
  index?: number;
};

export function Feedback({ data, index }: FeedbackProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const ref = useRef<HTMLParagraphElement | null>(null);
  const criterias = [
    {
      category: "Structure",
      value: data.criteriaScores.structure,
    },
    {
      category: "Communication",
      value: data.criteriaScores.communication,
    },
    {
      category: "Content",
      value: data.criteriaScores.content,
    },
    {
      category: "Technical Accuracy",
      value: data.criteriaScores.technicalAccuracy,
    },
  ];

  const renderStars = (score: number) => {
    return Array.of(1, 2, 3, 4, 5).map((value, idx) => {
      if (score >= value)
        return <Star key={idx} size={24} fill="currentColor" />;
      if (score >= value - 0.5)
        return <StarHalf key={idx} size={24} fill="currentColor" />;
      return null;
    });
  };

  const copy = async () => {
    const p = ref.current;

    if (!p || !p.textContent) return;

    await navigator.clipboard.writeText(p.textContent);

    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <div className="">
      {/* HEADER & SCORE */}
      <div className="flex flex-col items-center text-center gap-4 mb-10">
        {index !== undefined ? (
          <Badge className="bg-accent/20 hover:bg-accent/20 p-1 border border-border text-foreground font-medium rounded-full text-sm px-3 shadow-none">
            Question {index + 1} Feedback
          </Badge>
        ) : null}

        {/* <div className="space-y-1">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-7xl font-bold tracking-tight">
              {data.score}
            </span>
            <span className="text-2xl text-muted-foreground/50 font-medium">
              / 5
            </span>
          </div>
          <div className="flex items-center gap-1 text-chart-4">
            {renderStars(data.score)}
          </div>
        </div> */}
      </div>

      {/* CRITERIA MINI-GRID */}
      <div className="grid grid-cols-4 gap-4">
        {/* OVERALL SCORE */}
        <Card className="col-span-2 flex flex-col justify-center items-center p-5 text-center ring-2">
          <CardDescription>Answer Score</CardDescription>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-7xl font-bold tracking-tight">
              {data.score}
            </span>
            <span className="text-2xl text-muted-foreground/50 font-medium">
              / 5
            </span>
          </div>
          <div className="flex items-center gap-1 text-chart-4">
            {renderStars(data.score)}
          </div>
        </Card>

        {/* RADAR CHART */}
        <Card className="p-3 flex justify-center items-center">
          <SummaryChart data={criterias} />
        </Card>

        {criterias.map((item, idx) => (
          <Card key={idx} className="col-span-2 lg:col-span-1 border-border/50">
            <CardContent className="flex flex-col justify-center items-center p-1">
              <h4 className="text-sm text-muted-foreground">{item.category}</h4>
              <span className="font-semibold text-3xl">{item.value}</span>
            </CardContent>
          </Card>
        ))}

        <Card className="border-border/50 col-span-2">
          <CardContent className="flex flex-col justify-center items-start">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={18} />
              <h3 className="font-bold text-sm uppercase tracking-wide">
                Strength
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-7">
              {data.strengths}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 col-span-2">
          <CardContent className="flex flex-col justify-center items-start">
            <div className="flex items-center gap-2 mb-2 text-destructive">
              <CircleAlert size={18} />
              <h3 className="font-bold text-sm uppercase tracking-wide">
                Improvement
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-7">
              {data.areasToImprove}
            </p>
          </CardContent>
        </Card>

        <Card className="border-none col-span-2 bg-accent/20">
          <CardContent className="flex flex-col justify-center items-start">
            <div className="flex w-full justify-between items-end mb-4">
              <div className="flex items-center gap-2">
                <Lightbulb size={18} />
                <h3 className="font-bold text-sm uppercase tracking-wide">
                  {index !== undefined ? "Suggested Answer" : "Suggestion"}
                </h3>
              </div>
              <TooltipHover content="Copy to clipboard">
                <Button disabled={copied} onClick={copy} variant={"ghost"}>
                  {!copied ? <Copy className="size-3.5" /> : <Check />}
                </Button>
              </TooltipHover>
            </div>
            <p ref={ref} className="text-muted-foreground leading-relaxed pl-7">
              {data.suggestedAnswer}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
