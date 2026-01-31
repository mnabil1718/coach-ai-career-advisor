import { Briefcase, MessageCircle, Upload } from "lucide-react";

const items: WorksItemProps[] = [
  {
    idx: 1,
    icon: <Upload size={30} />,
    title: "Upload your CV",
    desc: "Drop your CV and tell us your target role. Our AI analyzes it instantly.",
  },
  {
    idx: 2,
    icon: <MessageCircle size={30} />,
    title: "Get Feedback & practice",
    desc: "Receive CV improvements and practice mock interviews with realistic questions.",
  },
  {
    idx: 3,
    icon: <Briefcase size={30} />,
    title: "Land your Dream Job",
    desc: "Apply with confidence using your improved CV and interview skills.",
  },
];

export function Works() {
  return (
    <section className="py-32 w-full p-3">
      <div className="mx-auto max-w-5xl">
        <header className="mb-16">
          <h1 className="text-2xl lg:text-4xl font-bold !leading-tight text-center mb-3">
            How Coach.ai works
          </h1>
          <p className="text-base md:text-lg text-muted-foreground text-center">
            Be job-ready in 10 minutes and land your dream job
          </p>
        </header>
        <ul className="relative grid grid-cols-1 lg:grid-cols-3 gap-7">
          {/* horizontal connector */}
          <div className="hidden lg:flex absolute top-[160px] left-0 w-full items-center">
            <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
            <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
          </div>
          {items.map((w, i) => {
            return (
              <WorksItem
                key={i}
                idx={w.idx}
                icon={w.icon}
                title={w.title}
                desc={w.desc}
              />
            );
          })}
        </ul>
      </div>
    </section>
  );
}

type WorksItemProps = {
  icon: React.ReactNode;
  idx: number;
  title: string;
  desc: string;
};

export function WorksItem({ icon, idx, title, desc }: WorksItemProps) {
  return (
    <li className="grid-cols-1 flex flex-col items-center p-5 lg:opacity-50 hover:opacity-100 duration-300">
      <div className="w-24 h-24 border border-border/50 rounded-full flex justify-center items-center mb-7">
        {icon}
      </div>
      <div className="bg-foreground text-background rounded-full w-8 h-8 flex justify-center items-center text-sm font-bold mb-3">
        {idx}
      </div>
      <h2 className="font-bold text-lg mb-3">{title}</h2>
      <p className="text-muted-foreground text-center">{desc}</p>
    </li>
  );
}
