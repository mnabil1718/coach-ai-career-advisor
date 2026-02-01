"use server"

import { createClient } from "@/lib/supabase/server";

  export async function logout(): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

  };