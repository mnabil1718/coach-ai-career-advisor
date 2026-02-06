import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";

type SummaryChartProp = {
  category: string;
  value: number;
};

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function SummaryChart({
  data,
  max = 10,
}: {
  data: SummaryChartProp[];
  max?: number;
}) {
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
        <PolarRadiusAxis domain={[0, max]} tick={false} axisLine={false} />
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
