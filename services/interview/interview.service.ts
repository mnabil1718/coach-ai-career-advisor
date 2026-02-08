"use server"

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "../auth/user.service";
import { ActionResult } from "@/types/action.type";
import { FeedbackSchemaType, Interview, InterviewQuestionAnswer, QuestionsArraySchemaType } from "@/types/interview.type";

export async function createInterview(sessionId: string, targetRole: string, level: string): Promise<ActionResult<Interview>> {

        const supabase = await createClient();
    
        const {data: user} = await getCurrentUser();
    
        if (!user) throw new Error("authentication required");
    
        const { data, error } = await supabase.from("interview").insert({
            session_id: sessionId,
            user_id: user.sub,
            target_role: targetRole,
            target_role_level: level,
        }).select("*").single();
    
        if (error) throw error;

    return { data };

}

// insert questions into question answers table (QA)
export async function insertQAs(interviewId: string, array: QuestionsArraySchemaType): Promise<ActionResult<InterviewQuestionAnswer[]>> {

    const supabase = await createClient();

    const {data: user} = await getCurrentUser();
    
    if (!user) throw new Error("authentication required");

    const { data, error } = await supabase.from("interview_qas").insert(
        array.map((q) => ({
                user_id: user.sub,
                interview_id: interviewId, 
                question: q.question, 
                step: q.sequence,
                type: q.type, 
            })),
    ).select();

    if (error) throw error;

    return { data: data! };
}

// because step is unique per question/answer, we can use it to target the right question index
export async function saveAnswer(interviewId: string, step: number, answer: string | null): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("interview_qas").update({
        answer,
    }).eq("step", step) // step is unique
    .eq("interview_id", interviewId); 

    if (error) throw error;
}

export async function saveFeedback(interviewId: string, step: number, feedback: FeedbackSchemaType): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("interview_qas").update({
        feedback,
    }).eq("step", step)
    .eq("interview_id", interviewId);

    if (error) throw error;
}

export async function updateStep(interviewId: string, step: number): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("interview").update({
        step,
    }).eq("id", interviewId);

    if (error) throw error;
}

export async function getInterview(interviewId: string): Promise<ActionResult<Interview>> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
        .from("interview")
        .select()
        .eq("id", interviewId)
        .single();

    if (error) throw error;
    
    return { data: data! };
}

export async function getInterviewWithRelations(interviewId: string) {
    const supabase = await createClient();
    
    const { data, error } = await supabase
        .from("interview")
        .select(`
            target_role,
            target_role_level,
            interview_qas (
                question,
                type,
                answer,
                feedback
            )
        `)
        .eq("id", interviewId)
        .single();

    if (error) throw error;
    return data;
}

export async function saveInterviewResult(interviewId: string, result: FeedbackSchemaType) {
    const supabase = await createClient();

    const { error } = await supabase.from("interview").update({
        result,
    }).eq("id", interviewId);

    if (error) throw error;
}

export async function getInterviewBySessionId(sessionId: string): Promise<ActionResult<Interview | null>> {
        const supabase = await createClient();

    const { data, error } = await supabase.from("interview").select().eq("session_id", sessionId).maybeSingle();

    if (error) throw error;

    return { data }
}

export async function getQuestionAnswer(interviewId: string, step: number): Promise<ActionResult<InterviewQuestionAnswer>> {

        const supabase = await createClient();

    const { data, error } = await supabase.from("interview_qas")
    .select()
    .eq("interview_id", interviewId)
    .eq("step", step).maybeSingle();

    if (error) {
        throw error;
    }   

    if (!data) throw new Error("Question answer not found");

    return { data }
}

export async function getQuestionAnswersByInterviewId(interviewId: string): Promise<ActionResult<InterviewQuestionAnswer[]>> {

    const supabase = await createClient();

    const { data, error } = await supabase.from("interview_qas")
    .select()
    .eq("interview_id", interviewId);

    if (error) {
        throw error;
    }   

    return { data }
}

export async function deleteInterview(interviewId: string): Promise<void> {
        const supabase = await createClient();

    const { error } = await supabase.from("interview")
    .delete()
    .eq("id", interviewId)
    .order("step", { ascending: true });

    if (error) throw error;
}