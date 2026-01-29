"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signInWithGoogle = async () => {
  const origin = (await headers()).get("origin");
  console.log("ORIGIN", origin);
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  console.error("ERROR", error);
  console.error("DATA", data);

  if (data.url) {
    redirect(data.url);
  }
};