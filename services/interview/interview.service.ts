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
        array.questions.map((q) => ({
                user_id: user.sub,
                interview_id: interviewId, 
                question: q.question, 
                type: q.type, 
            })),
    ).select();

    if (error) throw error;

    return { data: data! };
}

export async function saveAnswer(qaId: string, answer: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("interview_qas").update({
        answer,
    }).eq("id", qaId);

    if (error) throw error;
}

export async function saveFeedback(qaId: string, feedback: FeedbackSchemaType): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("interview_qas").update({
        feedback,
    }).eq("id", qaId);

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