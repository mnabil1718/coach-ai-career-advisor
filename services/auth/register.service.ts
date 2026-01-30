"use server"

import { ActionResult } from "@/types/action.type";
import { RegisterFormType } from "@/types/auth.type";
import { createClient } from "@/lib/supabase/server";

export async function register(data: RegisterFormType): Promise<ActionResult<void>> {
    const { email, password } = data;

    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) return { error: error.message };

      const { error: loginErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginErr) return { error: loginErr.message };

      return { error: null };
}