'use server'

import { ActionResult } from "@/types/action.type";
import { createClient } from "@/lib/supabase/server";

export async function login({ email, password }: { email: string, password: string }): Promise<ActionResult<void>> {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
}