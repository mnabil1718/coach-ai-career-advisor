"use server"

import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types/action.type";
import { CoachingStage, Session, SessionWithRelations } from "@/types/session.type";
import { redirect } from "next/navigation";

export async function createSession(): Promise<ActionResult<Session>> {
    const supabase = await createClient();

    // use default values
    const { data, error } = await supabase.from("coaching_sessions").insert({}).select("*").single();

    if (error) throw error;

    return { data };
}




export async function getSession(id: string): Promise<ActionResult<Session>> {
    const supabase = await createClient();

    const {data, error} = await supabase.from("coaching_sessions").select("*").eq("id", id).single();

    if (error) throw error;

    return { data };
}

export async function getSessionWithRelations(id: string): Promise<ActionResult<SessionWithRelations>> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("coaching_sessions")
        .select(`
            *,
            interview (
            id,
            step,
            result
            ),
            skill_gaps (
            id,
            result
            ),
            cv_reviews (
            id,
            review
            )
        `)
        .eq("id", id)
        .single();

  if (error) throw error;

  return { data };
}

export async function getSessions(): Promise<ActionResult<Session[]>> {
    const supabase = await createClient();

    const {data, error} = await supabase.from("coaching_sessions").select("*").order("created_at", { ascending: false });

    if (error) throw error;

    return { data };
}


export async function renameSession(id: string, title: string): Promise<void> {

    const supabase = await createClient();

    const { error } = await supabase.from("coaching_sessions").update({
        title,
    }).eq("id", id);

    if (error) throw error;
}

export async function updateSessionStage(id: string, stage: CoachingStage): Promise<void> {

    const supabase = await createClient();

    const { data: session } = await getSession(id);

    if (!session) throw new Error("Session not found");

    if (stage === "MOCK_INTERVIEW" && session.stage !== "CV_REVIEW") return;

    if (stage === "SKILL_GAP" && session.stage !== "MOCK_INTERVIEW") return;

    const { error } = await supabase.from("coaching_sessions").update({
        stage: stage || "CV_REVIEW",
    }).eq("id", id);

    if (error) throw error;
}


export async function deleteSession(id: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase.from("coaching_sessions").delete().eq("id", id);

    if (error) throw error;
}

export async function resumeSession(id: string): Promise<void> {

    const {data: session} = await getSessionWithRelations(id);

    if (!session) throw new Error("Session not found");

    if (session.status === "COMPLETED") return;

    const gap = session.skill_gaps;

    if (gap) {
        
        if (gap.result) redirect(`/sessions/${id}/gaps/${gap.id}/result`);

        redirect(`/sessions/${id}/gaps/${gap.id}`);
    }

    const interview = session.interview;

    if (interview) {

        if (interview.result) redirect(`/sessions/${id}/mock/${interview.id}/result`);

        redirect(`/sessions/${id}/mock?interviewId=${interview.id}&step=${interview.step}`);

    }

    const review = session.cv_reviews;

    if (review) {
        if (review.review) redirect(`/sessions/${id}/review`);

        redirect(`/sessions/${id}/verify`);
    }

}

