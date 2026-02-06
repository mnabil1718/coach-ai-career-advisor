"use client";

import { QuestionAnswerPair } from "@/types/interview.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import { MessageSquareText } from "lucide-react";
import { CollapseButton } from "../collapse-button";

export function AnswerOverview({ pairs }: { pairs: QuestionAnswerPair[] }) {
  const [open, setOpen] = useState<boolean>(false);

  // use memo to avoid sorting on every render
  const sorted = useMemo(() => {
    return [...pairs].sort((a, b) => a.question.sequence - b.question.sequence);
  }, [pairs]);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full mb-2">
      <Card className="border-border/50 shadow-none overflow-hidden">
        <CardHeader className="py-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <MessageSquareText />
              Answers Overview
            </CardTitle>
            <CollapsibleTrigger asChild>
              <div className="cursor-pointer hover:bg-accent rounded-full p-1 transition-colors">
                <CollapseButton open={open} />
              </div>
            </CollapsibleTrigger>
          </div>
        </CardHeader>

        <CollapsibleContent className="border-t border-border/50">
          <CardContent className="p-10">
            {sorted.map((item, idx) => (
              <div
                key={idx}
                className="relative pl-8 py-8 border-l border-border/50 space-y-5"
              >
                {/* Step Indicator Dot */}
                <div className="absolute -left-[5px] top-14 w-2.5 h-2.5 ring-2 rounded-full bg-background border border-border" />

                {/* Question Metadata */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-base font-medium text-muted-foreground">
                    Question {item.question.sequence}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-xs bg-accent/10 font-medium px-3 py-1 rounded-full"
                  >
                    {item.question.type[0].toUpperCase()}
                    {item.question.type.slice(1)}
                  </Badge>
                </div>

                {/* The Question */}
                <div className="space-y-1">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.question.question}
                  </p>
                </div>

                {/* The Answer */}
                <div className="bg-accent/5 rounded-xl p-4 border border-border/50 group relative">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquareText className="w-3.5 h-3.5 text-primary/70" />
                    <span className="text-sm font-medium text-muted-foreground tracking-tight">
                      Candidate Response
                    </span>
                  </div>

                  {item.answer ? (
                    <p className="text-base leading-relaxed">{item.answer}</p>
                  ) : (
                    <p className="text-xs italic text-muted-foreground/60">
                      No response recorded for this question.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
