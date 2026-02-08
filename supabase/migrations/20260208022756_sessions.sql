alter table "public"."coaching_sessions" alter column "stage" drop default;

alter table "public"."coaching_sessions" alter column stage type "public"."COACHING_STAGE" using stage::text::"public"."COACHING_STAGE";

alter table "public"."coaching_sessions" alter column "stage" set default 'CV_REVIEW'::public."COACHING_STAGE";

alter table "public"."coaching_sessions" add column "title" text not null default 'My New Session'::text;

alter table "public"."coaching_sessions" alter column "stage" set not null;

CREATE UNIQUE INDEX skill_gaps_session_id_key ON public.skill_gaps USING btree (session_id);

alter table "public"."skill_gaps" add constraint "skill_gaps_session_id_key" UNIQUE using index "skill_gaps_session_id_key";

grant delete on table "public"."coaching_sessions" to "postgres";

grant insert on table "public"."coaching_sessions" to "postgres";

grant references on table "public"."coaching_sessions" to "postgres";

grant select on table "public"."coaching_sessions" to "postgres";

grant trigger on table "public"."coaching_sessions" to "postgres";

grant truncate on table "public"."coaching_sessions" to "postgres";

grant update on table "public"."coaching_sessions" to "postgres";

grant delete on table "public"."cv_reviews" to "postgres";

grant insert on table "public"."cv_reviews" to "postgres";

grant references on table "public"."cv_reviews" to "postgres";

grant select on table "public"."cv_reviews" to "postgres";

grant trigger on table "public"."cv_reviews" to "postgres";

grant truncate on table "public"."cv_reviews" to "postgres";

grant update on table "public"."cv_reviews" to "postgres";

grant delete on table "public"."interview" to "postgres";

grant insert on table "public"."interview" to "postgres";

grant references on table "public"."interview" to "postgres";

grant select on table "public"."interview" to "postgres";

grant trigger on table "public"."interview" to "postgres";

grant truncate on table "public"."interview" to "postgres";

grant update on table "public"."interview" to "postgres";

grant delete on table "public"."interview_qas" to "postgres";

grant insert on table "public"."interview_qas" to "postgres";

grant references on table "public"."interview_qas" to "postgres";

grant select on table "public"."interview_qas" to "postgres";

grant trigger on table "public"."interview_qas" to "postgres";

grant truncate on table "public"."interview_qas" to "postgres";

grant update on table "public"."interview_qas" to "postgres";

grant delete on table "public"."resumes" to "postgres";

grant insert on table "public"."resumes" to "postgres";

grant references on table "public"."resumes" to "postgres";

grant select on table "public"."resumes" to "postgres";

grant trigger on table "public"."resumes" to "postgres";

grant truncate on table "public"."resumes" to "postgres";

grant update on table "public"."resumes" to "postgres";

grant delete on table "public"."skill_gaps" to "postgres";

grant insert on table "public"."skill_gaps" to "postgres";

grant references on table "public"."skill_gaps" to "postgres";

grant select on table "public"."skill_gaps" to "postgres";

grant trigger on table "public"."skill_gaps" to "postgres";

grant truncate on table "public"."skill_gaps" to "postgres";

grant update on table "public"."skill_gaps" to "postgres";


  create policy "Users can update their own sessions"
  on "public"."coaching_sessions"
  as permissive
  for update
  to public
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));



