import { Tables } from "@/database.types";
import { GapsFormSchema, SkillsSchema } from "@/schema/gaps.schema";
import z from "zod";

export type GapsFormSchemaType = z.infer<typeof GapsFormSchema>;
export type SkillsSchemaType = z.infer<typeof SkillsSchema>;

export type SkillGaps = Tables<"skill_gaps">;