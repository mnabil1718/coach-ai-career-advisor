"use server";

import { createClient } from "@/lib/supabase/server";
import { SkillGapAnalysisSchemaType } from "@/schema/gaps.schema";
import { ActionResult } from "@/types/action.type";
import { SkillGaps, SkillsSchemaType } from "@/types/gaps.type";
import { getCurrentUser } from "../auth/user.service";

export async function createSkillGaps(sessionId: string, resumeId: string, target_role: string, skills: SkillsSchemaType): Promise<ActionResult<SkillGaps>> {
    const supabase = await createClient();

    const { data: user } = await getCurrentUser();

    if (!user) throw new Error("Action not allowed");

    const { data, error } = await supabase.from("skill_gaps").insert({
        session_id: sessionId,
        resume_id: resumeId,
        target_role,
        skills,
        user_id: user.sub,
    }).select().single();

    if (error) throw error;

    return { data: data! };
}

export async function saveSkillGapsResult(id: string, result: SkillGapAnalysisSchemaType): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase.from("skill_gaps").update({
        result,
    }).eq("id", id);

    if (error) throw error;

}

export async function getGap(id: string): Promise<ActionResult<SkillGaps>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from("skill_gaps").select("*").eq("id", id).maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("Skill gap result not found");

    return { data };
}


export async function getGapBySessionId(sessionId: string): Promise<ActionResult<SkillGaps>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from("skill_gaps").select("*").eq("session_id", sessionId).maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("Skill gap result not found");

    return { data };
}