"use server";

import { createClient } from "@/lib/supabase/server";
import { AnalysisSchemaType } from "@/schema/analysis.schema";
import { ParseResumeSchemaType } from "@/schema/resume.schema";
import { ActionResult } from "@/types/action.type";
import { CreateSessionPayload, CVReview } from "@/types/cv_review.type";



export async function createCVReview({ session_id, resume_id, parsed_content }: CreateSessionPayload): Promise<ActionResult<CVReview>> {
    const supabase = await createClient();

    // use default values
    const { data, error } = await supabase.from("cv_reviews").insert({
        session_id,
        resume_id,
        parsed_content,
    }).select("*").single();

    if (error) throw error;

    return { data };
}


export async function getCVReview(session_id: string): Promise<ActionResult<CVReview>> {
    const supabase = await createClient();

    const { data, error } = await supabase.from("cv_reviews").select("*").eq("session_id", session_id).single();

    if (error) throw error;

    return { data };
}

export async function saveParsedContent(session_id: string, formData: ParseResumeSchemaType): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("cv_reviews")
        .update({
            parsed_content: formData, // No stringify needed
        })
        .eq("session_id", session_id)
        .single();

    if (error) throw error;
}

export async function saveReviewResult(session_id: string, data: AnalysisSchemaType): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("cv_reviews")
        .update({
            review: data,
        })
        .eq("session_id", session_id)
        .single();

    if (error) throw error;
}







