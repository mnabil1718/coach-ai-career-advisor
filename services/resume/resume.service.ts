"use server"

import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types/action.type";
import { getCurrentUser } from "../auth/user.service";
import { Resume } from "@/types/resume.type";


export async function getUserResumes(): Promise<ActionResult<Resume[]>> {

const supabase = await createClient();

const { data, error } = await supabase
        .from("resumes")
        .select("*") 
        .order("created_at", { ascending: false }) 
        .limit(100)

    if (error) throw error;

    return { data };
}


export async function postResume(name: string, fullPath: string): Promise<void> {
    const supabase = await createClient();

    const {data: user} = await getCurrentUser();

    if (!user) throw new Error("authentication required");

    const { error } = await supabase.from("resumes").insert({
        name: name,
        path: fullPath,
        user_id: user.sub,
    });

    if (error) throw error;
}