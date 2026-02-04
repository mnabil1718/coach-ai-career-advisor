"use client";

import { CheckCircle2, Lightbulb } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AnalysisSchemaType,
  RecommendationItemType,
  RecommendationsType,
} from "@/schema/analysis.schema";
import { ReviewBadge } from "./review-badge";
import { useState } from "react";
import { Button } from "../ui/button";

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function ReviewReport({ review }: { review: AnalysisSchemaType }) {
  // Transform category data for radar chart
  const chartData = [
    { category: "Content", value: review.categories.contentQuality },
    { category: "Structure", value: review.categories.structureFormat },
    { category: "ATS", value: review.categories.atsOptimization },
    { category: "Skills", value: review.categories.skillsKeywords },
  ];

  return (
    <div className="w-full space-y-8 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* OVERALL SCORE */}
        <Card className="flex flex-col justify-center items-center p-3 text-center ring-2">
          <CardDescription>Overall CV Strength</CardDescription>
          <div className="relative flex items-end justify-center">
            <h2 className="text-6xl font-bold tracking-tighter">
              {review.overallScore}
            </h2>
            <p className="text-xl text-muted-foreground/70">/10</p>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Your profile is{" "}
            <span className="">
              {review.overallScore > 7 ? "Strong" : "Developing"}
            </span>
            . Check the insights below to improve.
          </p>
        </Card>

        {/* RADAR CHART */}
        <Card className="p-3 flex justify-center items-center">
          <SummaryChart data={chartData} />
        </Card>
      </div>

      {/* RECOMMEND */}
      <Recommendations recommendations={review.recommendations} />
    </div>
  );
}

type SummaryChartProp = {
  category: string;
  value: number;
};

function SummaryChart({ data }: { data: SummaryChartProp[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <RadarChart data={data}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <PolarGrid className="fill-accent/10" />
        <PolarAngleAxis
          dataKey="category"
          fontSize={12}
          className="font-medium"
        />
        <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
        <Radar
          dataKey="value"
          fill="hsl(var(--primary))"
          fillOpacity={0.4}
          stroke="hsl(var(--primary))"
          strokeWidth={2}
        />
      </RadarChart>
    </ChartContainer>
  );
}

function Recommendations({
  recommendations,
}: {
  recommendations: RecommendationsType;
}) {
  const [seeAll, setSeeAll] = useState<boolean>(false);
  const length = recommendations.length;
  const shown = 3;
  const filtered = seeAll ? recommendations : recommendations.slice(0, shown);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Lightbulb className="text-primary" />
        Top Recommendations
      </h3>

      {filtered.map((item, index) => (
        <RecommendationItem key={index} item={item} />
      ))}

      {!seeAll && (
        <div className="w-full flex justify-center">
          <Button
            size={"sm"}
            variant={"outline"}
            className="rounded-full"
            onClick={() => setSeeAll(true)}
          >
            See All {length} recommendations
          </Button>
        </div>
      )}
    </div>
  );
}

function RecommendationItem({ item }: { item: RecommendationItemType }) {
  return (
    <Card className="border-border/50 px-6 py-10">
      <CardHeader className="">
        <div className="flex items-center justify-between mb-1">
          <ReviewBadge priority={item.priority} />
          <span className="text-sm text-muted-foreground font-medium">
            {item.category}
          </span>
        </div>
        <CardTitle className="text-xl">{item.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {item.feedback}
        </p>

        {item.before && item.after && (
          <BeforeAfter before={item.before} after={item.after} />
        )}

        <div className="flex items-start gap-2 p-4 rounded bg-primary/5 border border-primary/10">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-sm font-medium">
            <span className="font-bold">Task: </span>
            {item.actionItem}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function BeforeAfter({ before, after }: { before: string; after: string }) {
  return (
    <div className="grid gap-3 rounded-lg bg-accent/20 text-sm border divide-y">
      <div className="gap-1 p-3">
        <span className="uppercase text-xs text-foreground/80">Before</span>
        <p className="">{before}</p>
      </div>
      <div className="gap-1 p-3">
        <span className="text-primary font-semibold uppercase text-xs">
          After
        </span>
        <p className="font-medium text-foreground">{after}</p>
      </div>
    </div>
  );
}
