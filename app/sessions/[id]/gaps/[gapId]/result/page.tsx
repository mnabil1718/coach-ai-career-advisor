import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SkillGapAnalysisSchema,
  SkillGapAnalysisSchemaType,
} from "@/schema/gaps.schema";
import { getGap } from "@/services/gaps/gaps.service";
import { validateData } from "@/utils/parse";
import { CheckCircle2, XCircle, Star, Clock, BookOpen } from "lucide-react";
import Link from "next/link";

export default async function GapResultPage({
  params,
}: {
  params: Promise<{ id: string; gapId: string }>;
}) {
  const { gapId } = await params;

  const { data: gap } = await getGap(gapId);

  const analysis = validateData<SkillGapAnalysisSchemaType>(
    SkillGapAnalysisSchema,
    gap!.result,
  );

  return (
    <div className="max-w-4xl mx-auto p-5 mt-12 space-y-8">
      {/* 1. Header & Summary */}
      <section className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight mb-5">
          Skill Gap Analysis
        </h1>
        <Badge
          variant={"outline"}
          className="py-2 px-4 rounded-full text-base bg-primary/5 mb-10"
        >
          Match Score: {analysis.match_score}
        </Badge>
        <p className="text-lg leading-relaxed">{analysis.analysis_summary}</p>
      </section>

      {/* 2. Skills Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SkillCard
          title="Matched"
          items={analysis.skills_analysis.matched}
          icon={<CheckCircle2 />}
          bgColor="bg-green-50"
        />
        <SkillCard
          title="Missing"
          items={analysis.skills_analysis.missing}
          icon={<XCircle />}
          bgColor="bg-red-50"
        />
        <SkillCard
          title="Nice to Have"
          items={analysis.skills_analysis.nice_to_have}
          icon={<Star />}
          bgColor="bg-amber-50"
        />
      </div>

      {/* 3. Learning Roadmap */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Personalized Learning Roadmap
        </h2>

        <div className="space-y-4">
          {analysis.learning_roadmap.map((item, idx) => (
            <div
              key={idx}
              className="border rounded-xl p-5 hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
                <div>
                  <h3 className="text-lg font-bold">{item.skill_name}</h3>
                  <span
                    className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                      item.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="w-4 h-4" />
                  {item.estimated_time}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 uppercase mb-2">
                    Recommended Courses
                  </h4>
                  <ul className="space-y-2">
                    {item.recommended_resources.map((res, i) => {
                      const [platform, title, cost] = res
                        .split("|")
                        .map((s) => s.trim());
                      return (
                        <li
                          key={i}
                          className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded border border-slate-100"
                        >
                          <span>
                            <span className="font-medium text-blue-600">
                              {platform}:
                            </span>{" "}
                            {title}
                          </span>
                          <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            {cost}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 uppercase mb-2">
                    Practice Project
                  </h4>
                  <p className="text-sm text-slate-700 bg-amber-50 p-3 rounded border border-amber-100">
                    {item.practice_project}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex w-full justify-center">
          <Link href={"/dashboard"}>
            <Button className="font-semibold px-4 py-2 rounded-full">
              Finish Session
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function SkillCard({
  title,
  items,
  icon,
  bgColor,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
  bgColor: string;
}) {
  return (
    <div className={`p-4 rounded-xl border ${bgColor}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-bold text-slate-800">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((skill, i) => (
            <span
              key={i}
              className="bg-white/80 px-2 py-1 rounded-md text-sm border border-black/5 shadow-sm"
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-xs text-slate-400 italic">None identified</span>
        )}
      </div>
    </div>
  );
}
