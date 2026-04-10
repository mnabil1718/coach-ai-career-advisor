"use client";

import {
    useFieldArray,
    useForm,
    Controller,
    useFormContext,
    FormProvider,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "nextjs-toploader/app";
import {
    ParseResumeSchema,
    ParseResumeSchemaType,
} from "@/schema/resume.schema";
import { CVReview } from "@/types/cv_review.type";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
    Trash2,
    Plus,
    Mail,
    Phone,
    MapPin,
    Linkedin,
    Globe,
    School,
    FolderGit2,
    Wrench,
    X,
    LoaderCircle,
    SquareUserRound,
    Briefcase,
} from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { useState } from "react";
import { CollapseButton } from "./collapse-button";
import { Textarea } from "./ui/textarea";
import { toastLoading, toastSuccess } from "@/utils/toast";
import { analyzeCV } from "@/services/llm/analyze.service";
import {
    saveParsedContent,
    saveReviewResult,
} from "@/services/cv_reviews/reviews.service";
import Link from "next/link";
import { tryCatchWrapper } from "@/utils/try-catch-wrapper";

const TOAST_ID = "analyze";

function getInitData(json: unknown): ParseResumeSchemaType {
    const result = ParseResumeSchema.safeParse(json);

    if (!result.success) {
        // fallback to empty if parsing fails
        return {
            personalInfo: {},
            workExperience: [],
            education: [],
            skills: [],
            projects: [],
        };
    }
    return result.data;
}

export function VerifyForm({
    session_id,
    initData,
}: {
    session_id: string;
    initData: CVReview;
}) {
    const router = useRouter();

    const form = useForm<ParseResumeSchemaType>({
        resolver: zodResolver(ParseResumeSchema),
        mode: "onSubmit",
        defaultValues: getInitData(initData.parsed_content),
    });

    const onSubmit = async (data: ParseResumeSchemaType) => {
        const result = await tryCatchWrapper(async () => {
            toastLoading("Saving data...", undefined, TOAST_ID, false);
            await saveParsedContent(session_id, data);
            toastLoading("Analyzing data...", undefined, TOAST_ID, true);
            const { data: analysis } = await analyzeCV(data);
            await saveReviewResult(session_id, analysis!);
            toastSuccess("Review result ready", undefined, TOAST_ID);

            return true; // explicit success signal
        }, TOAST_ID);

        if (!result) return;

        router.push(`/sessions/${session_id}/review`);
    };

    return (
        <FormProvider {...form}>
            <header className="mt-12 mb-6 text-center">
                <h1 className="text-xl font-medium mb-2">Review Parsed Data</h1>
                <p className="text-sm text-muted-foreground">
                    Feel free to add, edit, or delete parsed data to better reflect your
                    position before proceeding our AI analysis.
                </p>
            </header>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full"
            >
                <PersonalInfoForm />
                <WorkForm />
                <EducationForm />
                <ProjectForm />
                <SkillForm />

                <div className="flex justify-between gap-4 mt-2 mb-12">
                    <Link href={"/dashboard"}>
                        <Button type="button" variant="ghost" className="rounded-full">
                            Back
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="px-4 py-3 font-bold rounded-full"
                    >
                        {form.formState.isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <LoaderCircle className="animate-spin" />
                                Processing...
                            </span>
                        ) : (
                            "Save & Analyze CV"
                        )}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}

export function PersonalInfoForm() {
    const form = useFormContext<ParseResumeSchemaType>();
    const [open, setOpen] = useState<boolean>(true);

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <SquareUserRound className="w-5 h-5 text-muted-foreground" />
                            Personal Information
                        </CardTitle>
                        <CollapsibleTrigger className="bg-accent/20 rounded-full p-2">
                            <CollapseButton open={open} />
                        </CollapsibleTrigger>
                    </div>
                </CardHeader>
                <CollapsibleContent>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Controller
                                name="personalInfo.fullName"
                                control={form.control}
                                render={({ field }) => (
                                    <Field className="col-span-2">
                                        <FieldLabel>Full Name</FieldLabel>
                                        <Input
                                            {...field}
                                            value={field.value ?? ""}
                                            placeholder="John Doe"
                                        />
                                    </Field>
                                )}
                            />
                            <Controller
                                name="personalInfo.email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field
                                        className="col-span-1"
                                        data-invalid={fieldState.invalid}
                                    >
                                        <FieldLabel>Email</FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                {...field}
                                                value={field.value ?? ""}
                                                placeholder="email@example.com"
                                            />
                                            <InputGroupAddon>
                                                <Mail />
                                            </InputGroupAddon>
                                        </InputGroup>
                                        {fieldState.error && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="personalInfo.phone"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field
                                        className="col-span-1"
                                        data-invalid={fieldState.invalid}
                                    >
                                        <FieldLabel>Phone</FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                {...field}
                                                value={field.value ?? ""}
                                                placeholder="+62 xxx-xxxx-xxxx"
                                            />
                                            <InputGroupAddon>
                                                <Phone />
                                            </InputGroupAddon>
                                        </InputGroup>
                                        {fieldState.error && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="personalInfo.location"
                                control={form.control}
                                render={({ field }) => (
                                    <Field className="col-span-2">
                                        <FieldLabel>Location</FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                {...field}
                                                value={field.value ?? ""}
                                                placeholder="Sawangan Depok, West Java, Indonesia"
                                            />
                                            <InputGroupAddon>
                                                <MapPin />
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </Field>
                                )}
                            />

                            <Controller
                                name="personalInfo.linkedin"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field
                                        className="col-span-1"
                                        data-invalid={fieldState.invalid}
                                    >
                                        <FieldLabel>Linkedin</FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                {...field}
                                                value={field.value ?? ""}
                                                placeholder="Enter you linkedin profile"
                                            />
                                            <InputGroupAddon>
                                                <Linkedin />
                                            </InputGroupAddon>
                                        </InputGroup>

                                        {fieldState.error && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="personalInfo.website"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field
                                        className="col-span-1"
                                        data-invalid={fieldState.invalid}
                                    >
                                        <FieldLabel>Website</FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                {...field}
                                                value={field.value ?? ""}
                                                placeholder="yourwebsite.com"
                                            />
                                            <InputGroupAddon>
                                                <Globe />
                                            </InputGroupAddon>
                                        </InputGroup>

                                        {fieldState.error && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}

export function WorkForm() {
    const [open, setOpen] = useState<boolean>(true);
    const form = useFormContext<ParseResumeSchemaType>();

    const workFields = useFieldArray({
        control: form.control,
        name: "workExperience",
    });

    const addWork = () => {
        workFields.prepend({
            company: "",
            role: "",
            description: "",
            startDate: "",
            endDate: "",
        });
    };

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-muted-foreground" />
                        Work Experiences
                    </CardTitle>
                    <CollapsibleTrigger className="bg-accent/20 rounded-full p-2">
                        <CollapseButton open={open} />
                    </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                    <CardContent className="space-y-4">
                        <Button
                            size="sm"
                            type="button"
                            variant={"outline"}
                            onClick={addWork}
                            className="w-full py-4 border-dashed"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add New Job
                        </Button>

                        {workFields.fields.map((field, index) => (
                            <div key={field.id} className="p-4 border rounded-lg relative">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-destructive"
                                    onClick={() => workFields.remove(index)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <Field className="col-span-2">
                                        <FieldLabel>Company</FieldLabel>
                                        <Input
                                            {...form.register(`workExperience.${index}.company`)}
                                        />
                                    </Field>
                                    <Field className="col-span-2">
                                        <FieldLabel>Role</FieldLabel>
                                        <Input {...form.register(`workExperience.${index}.role`)} />
                                    </Field>
                                    <Field className="col-span-1">
                                        <FieldLabel>Start Date</FieldLabel>
                                        <Input
                                            {...form.register(`workExperience.${index}.startDate`)}
                                        />
                                    </Field>
                                    <Field className="col-span-1">
                                        <FieldLabel>End Date</FieldLabel>
                                        <Input
                                            {...form.register(`workExperience.${index}.endDate`)}
                                        />
                                    </Field>
                                    <Field className="col-span-2">
                                        <FieldLabel>Description</FieldLabel>
                                        <Textarea
                                            {...form.register(`workExperience.${index}.description`)}
                                            className="min-h-[100px] resize-y overflow-auto"
                                            placeholder="Describe your achievements..."
                                        ></Textarea>
                                    </Field>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}

export function EducationForm() {
    const [open, setOpen] = useState<boolean>(true);
    const form = useFormContext<ParseResumeSchemaType>();

    const educationFields = useFieldArray({
        control: form.control,
        name: "education",
    });

    const addEducation = () => {
        educationFields.prepend({
            institution: "",
            degree: "",
            fieldOfStudy: "",
            graduationDate: "",
        });
    };

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <School className="w-5 h-5 text-muted-foreground" />
                        Education
                    </CardTitle>
                    <CollapsibleTrigger className="bg-accent/20 rounded-full p-2">
                        <CollapseButton open={open} />
                    </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                    <CardContent className="space-y-4">
                        <Button
                            size="sm"
                            type="button"
                            variant="outline"
                            onClick={addEducation}
                            className="w-full py-4 border-dashed"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Education
                        </Button>

                        {educationFields.fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="p-4 border rounded-lg relative bg-muted/10"
                            >
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-destructive"
                                    onClick={() => educationFields.remove(index)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                    <Field className="col-span-2">
                                        <FieldLabel>Institution</FieldLabel>
                                        <Input
                                            {...form.register(`education.${index}.institution`)}
                                            placeholder="University Name"
                                        />
                                    </Field>
                                    <Field className="col-span-2 md:col-span-1">
                                        <FieldLabel>Degree</FieldLabel>
                                        <Input
                                            {...form.register(`education.${index}.degree`)}
                                            placeholder="Bachelor's, Master's, etc."
                                        />
                                    </Field>
                                    <Field className="col-span-2 md:col-span-1">
                                        <FieldLabel>Field of Study</FieldLabel>
                                        <Input
                                            {...form.register(`education.${index}.fieldOfStudy`)}
                                            placeholder="Computer Science"
                                        />
                                    </Field>
                                    <Field className="col-span-2">
                                        <FieldLabel>Graduation Date</FieldLabel>
                                        <Input
                                            {...form.register(`education.${index}.graduationDate`)}
                                            placeholder="May 2024"
                                        />
                                    </Field>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}

export function ProjectForm() {
    const [open, setOpen] = useState<boolean>(true);
    const form = useFormContext<ParseResumeSchemaType>();

    const projectFields = useFieldArray({
        control: form.control,
        name: "projects",
    });

    const addProject = () => {
        projectFields.prepend({
            name: "",
            description: "",
            link: "",
        });
    };

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <FolderGit2 className="w-5 h-5 text-muted-foreground" />
                        Projects
                    </CardTitle>
                    <CollapsibleTrigger className="bg-accent/20 rounded-full p-2">
                        <CollapseButton open={open} />
                    </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                    <CardContent className="space-y-4">
                        <Button
                            size="sm"
                            type="button"
                            variant="outline"
                            onClick={addProject}
                            className="w-full py-4 border-dashed"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add New Project
                        </Button>

                        {projectFields.fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="p-4 border rounded-lg relative bg-muted/10"
                            >
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-destructive"
                                    onClick={() => projectFields.remove(index)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <Field className="col-span-2 md:col-span-1">
                                        <FieldLabel>Project Name</FieldLabel>
                                        <Input
                                            {...form.register(`projects.${index}.name`)}
                                            placeholder="Portfolio Website"
                                        />
                                    </Field>
                                    <Field className="col-span-2 md:col-span-1">
                                        <FieldLabel>Project Link</FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                {...form.register(`projects.${index}.link`)}
                                                placeholder="https://github.com/..."
                                            />
                                            <InputGroupAddon>
                                                <Globe className="w-4 h-4" />
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </Field>
                                    <Field className="col-span-2">
                                        <FieldLabel>Description</FieldLabel>
                                        <Textarea
                                            {...form.register(`projects.${index}.description`)}
                                            className="min-h-[80px] resize-y"
                                            placeholder="What did you build?"
                                        />
                                    </Field>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}

export function SkillForm() {
    const form = useFormContext<ParseResumeSchemaType>();
    const [open, setOpen] = useState<boolean>(true);
    const [inputValue, setInputValue] = useState("");

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Wrench className="w-5 h-5 text-muted-foreground" />
                            Skills
                        </CardTitle>
                        <CollapsibleTrigger className="bg-accent/20 rounded-full p-2">
                            <CollapseButton open={open} />
                        </CollapsibleTrigger>
                    </div>
                </CardHeader>
                <CollapsibleContent>
                    <CardContent>
                        <Controller
                            name="skills"
                            control={form.control}
                            render={({ field }) => {
                                const skills = field.value || [];

                                const handleKeyDown = (
                                    e: React.KeyboardEvent<HTMLInputElement>,
                                ) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        const trimmedValue = inputValue.trim();

                                        if (trimmedValue && !skills.includes(trimmedValue)) {
                                            field.onChange([...skills, trimmedValue]);
                                            setInputValue("");
                                        }
                                    } else if (
                                        e.key === "Backspace" &&
                                        !inputValue &&
                                        skills.length > 0
                                    ) {
                                        field.onChange(skills.slice(0, -1));
                                    }
                                };

                                const removeSkill = (indexToRemove: number) => {
                                    field.onChange(skills.filter((_, i) => i !== indexToRemove));
                                };

                                return (
                                    <Field className="col-span-2">
                                        <div className="flex flex-wrap gap-2 p-1.5 min-h-[42px] w-full rounded-md border border-input bg-background text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring">
                                            {/* Pill List */}
                                            {skills.map((skill, index) => (
                                                <div
                                                    key={`${skill}-${index}`}
                                                    className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-accent/30 text-secondary-foreground rounded-md"
                                                >
                                                    <span className="text-xs font-medium leading-none">
                                                        {skill}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkill(index)}
                                                        className="text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-accent p-0.5"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}

                                            {/* Input Field */}
                                            <input
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                placeholder={
                                                    skills.length === 0
                                                        ? "Type skill and press Enter..."
                                                        : ""
                                                }
                                                className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[140px] px-1 py-1"
                                            />
                                        </div>
                                        <span className="text-sm text-muted-foreground mt-2 px-1">
                                            Press{" "}
                                            <pre className="inline-block bg-accent/30 px-2 py-1 rounded mx-1 text-xs text-accent-foreground">
                                                Enter
                                            </pre>{" "}
                                            to add new skill.
                                        </span>
                                    </Field>
                                );
                            }}
                        />
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}
