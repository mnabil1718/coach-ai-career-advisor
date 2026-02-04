"use server"

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "../auth/user.service";
import { ActionResult } from "@/types/action.type";
import { Interview, QuestionsArraySchemaType } from "@/types/interview.type";

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
export async function insertQAs(interviewId: string, array: QuestionsArraySchemaType) {

    const supabase = await createClient();

    const {data: user} = await getCurrentUser();
    
    if (!user) throw new Error("authentication required");

    const { error } = await supabase.from("interview_qas").insert(
        array.questions.map((q) => ({
                user_id: user.sub,
                interview_id: interviewId, 
                question: q.question, 
                type: q.type, 
            })),
    );

    if (error) throw error;
}