'use server'

import { ActionResult } from "@/types/action.type";
import { createClient } from "@/lib/supabase/server";
import { JwtPayload } from "@supabase/supabase-js";


export async function getCurrentUser(): Promise<ActionResult<JwtPayload | undefined>> {
      const supabase = await createClient();
      const { data } = await supabase.auth.getClaims();
      const user = data?.claims;

      return { error: null, data: user };
    
}