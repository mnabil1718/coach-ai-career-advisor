import { Tables } from "@/database.types";
import { createClient } from "@/lib/supabase/server";
import { QueryData } from "@supabase/supabase-js";

export type Session = Tables<"coaching_sessions">;

export type CoachingStage = Tables<"coaching_sessions">["stage"];
export type CoachingStatus = Tables<"coaching_sessions">["status"];

const supabase = await createClient(); // Just for type inference context
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sessionQuery = supabase
    .from("coaching_sessions")
    .select(`
    *,
    interview (id, step, result),
    skill_gaps (id, result),
    cv_reviews (id, review)
  `)
    .single();

export type SessionWithRelations = QueryData<typeof sessionQuery>;
