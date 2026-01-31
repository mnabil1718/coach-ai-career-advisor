import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartSpline, FileText, MessageSquare } from "lucide-react";

const features: FeatureCardProps[] = [
  {
    title: "Resume Optimization & Feedback",
    desc: "Get instant, actionable feedback on your resume to pass ATS scanners and impress recruiters.",
    icon: <FileText />,
  },
  {
    title: "Mock Interview",
    desc: "Practice with realistic AI mock interviews tailored to your specific industry and role.",
    icon: <MessageSquare />,
  },
  {
    title: "Skill Gap Analysis",
    desc: "Discover exactly which skills you need for your dream role and get a personalized learning roadmap.",
    icon: <ChartSpline />,
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-32 bg-accent/20 w-full p-3">
      <div className="z-10 mx-auto max-w-5xl">
        <header className="mb-16">
          <h1 className="text-2xl lg:text-4xl font-bold !leading-tight text-center mb-3">
            Everything You Need to Advance
          </h1>
          <p className="text-base md:text-lg text-muted-foreground text-center">
            Personal AI career coach to help you land your dream job
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, idx) => {
            return (
              <FeatureCard
                key={idx}
                title={f.title}
                desc={f.desc}
                icon={f.icon}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

type FeatureCardProps = {
  title: string;
  desc: string;
  icon: React.ReactNode;
};

export function FeatureCard({ title, desc, icon }: FeatureCardProps) {
  return (
    <div className="col-span-1">
      <Card className="border-none shadow-none hover:shadow-xl hover:shadow-accent/30 h-full transition-all duration-200">
        <CardHeader>
          <div className="bg-accent/20 w-fit p-3 rounded-lg text-muted-foreground">
            {icon}
          </div>
          <CardTitle className="!mt-4 text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{desc}</p>
        </CardContent>
      </Card>
    </div>
  );
}
