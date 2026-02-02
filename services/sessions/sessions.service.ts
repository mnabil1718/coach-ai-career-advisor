"use server"

import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types/action.type";
import { Session } from "@/types/session.type";

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