import { GapAnalysisPDF } from "@/components/gaps/gaps-pdf";
import { DownloadPDFButton } from "@/components/review/download-pdf-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    SkillGapAnalysisSchema,
    SkillGapAnalysisSchemaType,
} from "@/schema/gaps.schema";
import { getGap } from "@/services/gaps/gaps.service";
import { getSession, updateSessionStatus } from "@/services/sessions/sessions.service";
import { validateData } from "@/utils/parse";
import { CheckCircle2, XCircle, Star, Clock, BookOpen } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function GapResultPage({
    params,
}: {
    params: Promise<{ id: string; gapId: string }>;
}) {
    const { id, gapId } = await params;
    const { data: session } = await getSession(id);
    const { data: gap } = await getGap(gapId);
    const analysis = validateData<SkillGapAnalysisSchemaType>(
        SkillGapAnalysisSchema,
        gap!.result,
    );

    const finish = async () => {
        "use server"
        await updateSessionStatus(id, "COMPLETED");
        redirect("/dashboard");
    }



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
                />
                <SkillCard
                    title="Missing"
                    items={analysis.skills_analysis.missing}
                    icon={<XCircle />}
                />
                <SkillCard
                    title="Nice to Have"
                    items={analysis.skills_analysis.nice_to_have}
                    icon={<Star />}
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
                            className="border rounded-xl p-5 hover:shadow-md transition-shadow bg-card"
                        >
                            <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
                                <div>
                                    <h3 className="mb-4 text-lg font-bold">{item.skill_name}</h3>
                                    <span
                                        className={`text-xs font-bold uppercase px-2 py-1 rounded ${item.priority === "High"
                                            ? "bg-destructive/10 text-destructive-foreground"
                                            : "bg-primary/10 text-foreground"
                                            }`}
                                    >
                                        {item.priority} Priority
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    {item.estimated_time}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-semibold uppercase mb-2">
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
                                                    className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded border border-border/30"
                                                >
                                                    <span>
                                                        <span>
                                                            {platform}
                                                        </span>{" "}
                                                        {title}
                                                    </span>
                                                    {/* <span className="text-sm"> */}
                                                    {/*     {cost} */}
                                                    {/* </span> */}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold uppercase mb-2">
                                        Practice Project
                                    </h4>
                                    <p className="text-sm p-3 rounded border">
                                        {item.practice_project}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex w-full justify-center gap-2">
                    <DownloadPDFButton
                        filename="Skills_Gap_Roadmap_Report.pdf"
                        document={<GapAnalysisPDF data={analysis} />}
                        buttonText="Download Report"
                    />
                    {
                        session && session.status === "PENDING" ?
                            (
                                <form action={finish}>
                                    <Button type="submit" className="font-semibold px-4 py-2 rounded-full">
                                        Finish Session
                                    </Button>
                                </form>
                            ) :
                            (
                                <Link href={"/dashboard"}>
                                    <Button className="font-semibold px-4 py-2 rounded-full">
                                        Go to Dashboard
                                    </Button>
                                </Link>
                            )
                    }
                </div>
            </section>
        </div>
    );
}

function SkillCard({
    title,
    items,
    icon,
}: {
    title: string;
    items: string[];
    icon: React.ReactNode;
}) {
    return (
        <Card className="rounded-xl border">
            <CardHeader className="flex items-center gap-2 border-b pb-3">
                {icon}
                <CardTitle className="font-bold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc px-4">
                    {items.length > 0 ? (
                        items.map((skill, i) => (
                            <li
                                key={i}
                            >
                                {skill}
                            </li>
                        ))
                    ) : (
                        <span className="text-xs text-muted-foreground italic">None identified</span>
                    )}
                </ul>
            </CardContent>
        </Card>
    );
}
