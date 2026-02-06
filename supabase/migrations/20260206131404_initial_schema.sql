create type "public"."COACHING_STAGE" as enum ('CV_REVIEW', 'MOCK_INTERVIEW', 'SKILL_GAP');

create type "public"."COACHING_STATUS" as enum ('PENDING', 'COMPLETED');


  create table "public"."coaching_sessions" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null default auth.uid(),
    "status" public."COACHING_STATUS" not null default 'PENDING'::public."COACHING_STATUS",
    "stage" public."COACHING_STAGE" default 'CV_REVIEW'::public."COACHING_STAGE"
      );


alter table "public"."coaching_sessions" enable row level security;


  create table "public"."cv_reviews" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "session_id" uuid not null default gen_random_uuid(),
    "parsed_content" jsonb,
    "review" jsonb,
    "suggestions" jsonb,
    "checklist" jsonb,
    "resume_id" uuid default gen_random_uuid(),
    "user_id" uuid default auth.uid()
      );


alter table "public"."cv_reviews" enable row level security;


  create table "public"."interview" (
    "id" uuid not null default gen_random_uuid(),
    "session_id" uuid not null default gen_random_uuid(),
    "target_role" text not null,
    "target_role_level" text not null,
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null default auth.uid(),
    "result" jsonb,
    "step" real not null default '1'::real
      );


alter table "public"."interview" enable row level security;


  create table "public"."interview_qas" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "type" text not null,
    "question" text not null,
    "answer" text,
    "feedback" jsonb,
    "interview_id" uuid not null,
    "user_id" uuid not null,
    "step" real not null
      );


alter table "public"."interview_qas" enable row level security;


  create table "public"."resumes" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "path" text not null,
    "created_at" timestamp with time zone not null default now(),
    "name" text not null
      );


alter table "public"."resumes" enable row level security;


  create table "public"."skill_gaps" (
    "id" uuid not null default gen_random_uuid(),
    "session_id" uuid not null default gen_random_uuid(),
    "target_role" text not null,
    "resume_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "result" jsonb,
    "skills" text[],
    "user_id" uuid not null
      );


alter table "public"."skill_gaps" enable row level security;

CREATE UNIQUE INDEX coaching_sessions_pkey ON public.coaching_sessions USING btree (id);

CREATE UNIQUE INDEX cv_reviews_pkey ON public.cv_reviews USING btree (id);

CREATE UNIQUE INDEX cv_reviews_session_id_key ON public.cv_reviews USING btree (session_id);

CREATE UNIQUE INDEX interview_pkey ON public.interview USING btree (id);

CREATE UNIQUE INDEX interview_qas_pkey ON public.interview_qas USING btree (id);

CREATE UNIQUE INDEX interview_qas_step_key ON public.interview_qas USING btree (step);

CREATE UNIQUE INDEX interview_session_id_key ON public.interview USING btree (session_id);

CREATE UNIQUE INDEX resumes_pkey ON public.resumes USING btree (id);

CREATE UNIQUE INDEX skill_gaps_pkey ON public.skill_gaps USING btree (id);

alter table "public"."coaching_sessions" add constraint "coaching_sessions_pkey" PRIMARY KEY using index "coaching_sessions_pkey";

alter table "public"."cv_reviews" add constraint "cv_reviews_pkey" PRIMARY KEY using index "cv_reviews_pkey";

alter table "public"."interview" add constraint "interview_pkey" PRIMARY KEY using index "interview_pkey";

alter table "public"."interview_qas" add constraint "interview_qas_pkey" PRIMARY KEY using index "interview_qas_pkey";

alter table "public"."resumes" add constraint "resumes_pkey" PRIMARY KEY using index "resumes_pkey";

alter table "public"."skill_gaps" add constraint "skill_gaps_pkey" PRIMARY KEY using index "skill_gaps_pkey";

alter table "public"."coaching_sessions" add constraint "coaching_sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."coaching_sessions" validate constraint "coaching_sessions_user_id_fkey";

alter table "public"."cv_reviews" add constraint "cv_reviews_resume_id_fkey" FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."cv_reviews" validate constraint "cv_reviews_resume_id_fkey";

alter table "public"."cv_reviews" add constraint "cv_reviews_session_id_fkey" FOREIGN KEY (session_id) REFERENCES public.coaching_sessions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."cv_reviews" validate constraint "cv_reviews_session_id_fkey";

alter table "public"."cv_reviews" add constraint "cv_reviews_session_id_key" UNIQUE using index "cv_reviews_session_id_key";

alter table "public"."cv_reviews" add constraint "cv_reviews_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."cv_reviews" validate constraint "cv_reviews_user_id_fkey";

alter table "public"."interview" add constraint "interview_session_id_fkey" FOREIGN KEY (session_id) REFERENCES public.coaching_sessions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."interview" validate constraint "interview_session_id_fkey";

alter table "public"."interview" add constraint "interview_session_id_key" UNIQUE using index "interview_session_id_key";

alter table "public"."interview" add constraint "interview_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."interview" validate constraint "interview_user_id_fkey";

alter table "public"."interview_qas" add constraint "interview_qas_interview_id_fkey" FOREIGN KEY (interview_id) REFERENCES public.interview(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."interview_qas" validate constraint "interview_qas_interview_id_fkey";

alter table "public"."interview_qas" add constraint "interview_qas_step_key" UNIQUE using index "interview_qas_step_key";

alter table "public"."interview_qas" add constraint "interview_qas_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."interview_qas" validate constraint "interview_qas_user_id_fkey";

alter table "public"."resumes" add constraint "resumes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."resumes" validate constraint "resumes_user_id_fkey";

alter table "public"."skill_gaps" add constraint "skill_gaps_resume_id_fkey" FOREIGN KEY (resume_id) REFERENCES public.resumes(id) not valid;

alter table "public"."skill_gaps" validate constraint "skill_gaps_resume_id_fkey";

alter table "public"."skill_gaps" add constraint "skill_gaps_session_id_fkey" FOREIGN KEY (session_id) REFERENCES public.coaching_sessions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."skill_gaps" validate constraint "skill_gaps_session_id_fkey";

alter table "public"."skill_gaps" add constraint "skill_gaps_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."skill_gaps" validate constraint "skill_gaps_user_id_fkey";

grant delete on table "public"."coaching_sessions" to "anon";

grant insert on table "public"."coaching_sessions" to "anon";

grant references on table "public"."coaching_sessions" to "anon";

grant select on table "public"."coaching_sessions" to "anon";

grant trigger on table "public"."coaching_sessions" to "anon";

grant truncate on table "public"."coaching_sessions" to "anon";

grant update on table "public"."coaching_sessions" to "anon";

grant delete on table "public"."coaching_sessions" to "authenticated";

grant insert on table "public"."coaching_sessions" to "authenticated";

grant references on table "public"."coaching_sessions" to "authenticated";

grant select on table "public"."coaching_sessions" to "authenticated";

grant trigger on table "public"."coaching_sessions" to "authenticated";

grant truncate on table "public"."coaching_sessions" to "authenticated";

grant update on table "public"."coaching_sessions" to "authenticated";

grant delete on table "public"."coaching_sessions" to "postgres";

grant insert on table "public"."coaching_sessions" to "postgres";

grant references on table "public"."coaching_sessions" to "postgres";

grant select on table "public"."coaching_sessions" to "postgres";

grant trigger on table "public"."coaching_sessions" to "postgres";

grant truncate on table "public"."coaching_sessions" to "postgres";

grant update on table "public"."coaching_sessions" to "postgres";

grant delete on table "public"."coaching_sessions" to "service_role";

grant insert on table "public"."coaching_sessions" to "service_role";

grant references on table "public"."coaching_sessions" to "service_role";

grant select on table "public"."coaching_sessions" to "service_role";

grant trigger on table "public"."coaching_sessions" to "service_role";

grant truncate on table "public"."coaching_sessions" to "service_role";

grant update on table "public"."coaching_sessions" to "service_role";

grant delete on table "public"."cv_reviews" to "anon";

grant insert on table "public"."cv_reviews" to "anon";

grant references on table "public"."cv_reviews" to "anon";

grant select on table "public"."cv_reviews" to "anon";

grant trigger on table "public"."cv_reviews" to "anon";

grant truncate on table "public"."cv_reviews" to "anon";

grant update on table "public"."cv_reviews" to "anon";

grant delete on table "public"."cv_reviews" to "authenticated";

grant insert on table "public"."cv_reviews" to "authenticated";

grant references on table "public"."cv_reviews" to "authenticated";

grant select on table "public"."cv_reviews" to "authenticated";

grant trigger on table "public"."cv_reviews" to "authenticated";

grant truncate on table "public"."cv_reviews" to "authenticated";

grant update on table "public"."cv_reviews" to "authenticated";

grant delete on table "public"."cv_reviews" to "postgres";

grant insert on table "public"."cv_reviews" to "postgres";

grant references on table "public"."cv_reviews" to "postgres";

grant select on table "public"."cv_reviews" to "postgres";

grant trigger on table "public"."cv_reviews" to "postgres";

grant truncate on table "public"."cv_reviews" to "postgres";

grant update on table "public"."cv_reviews" to "postgres";

grant delete on table "public"."cv_reviews" to "service_role";

grant insert on table "public"."cv_reviews" to "service_role";

grant references on table "public"."cv_reviews" to "service_role";

grant select on table "public"."cv_reviews" to "service_role";

grant trigger on table "public"."cv_reviews" to "service_role";

grant truncate on table "public"."cv_reviews" to "service_role";

grant update on table "public"."cv_reviews" to "service_role";

grant delete on table "public"."interview" to "anon";

grant insert on table "public"."interview" to "anon";

grant references on table "public"."interview" to "anon";

grant select on table "public"."interview" to "anon";

grant trigger on table "public"."interview" to "anon";

grant truncate on table "public"."interview" to "anon";

grant update on table "public"."interview" to "anon";

grant delete on table "public"."interview" to "authenticated";

grant insert on table "public"."interview" to "authenticated";

grant references on table "public"."interview" to "authenticated";

grant select on table "public"."interview" to "authenticated";

grant trigger on table "public"."interview" to "authenticated";

grant truncate on table "public"."interview" to "authenticated";

grant update on table "public"."interview" to "authenticated";

grant delete on table "public"."interview" to "postgres";

grant insert on table "public"."interview" to "postgres";

grant references on table "public"."interview" to "postgres";

grant select on table "public"."interview" to "postgres";

grant trigger on table "public"."interview" to "postgres";

grant truncate on table "public"."interview" to "postgres";

grant update on table "public"."interview" to "postgres";

grant delete on table "public"."interview" to "service_role";

grant insert on table "public"."interview" to "service_role";

grant references on table "public"."interview" to "service_role";

grant select on table "public"."interview" to "service_role";

grant trigger on table "public"."interview" to "service_role";

grant truncate on table "public"."interview" to "service_role";

grant update on table "public"."interview" to "service_role";

grant delete on table "public"."interview_qas" to "anon";

grant insert on table "public"."interview_qas" to "anon";

grant references on table "public"."interview_qas" to "anon";

grant select on table "public"."interview_qas" to "anon";

grant trigger on table "public"."interview_qas" to "anon";

grant truncate on table "public"."interview_qas" to "anon";

grant update on table "public"."interview_qas" to "anon";

grant delete on table "public"."interview_qas" to "authenticated";

grant insert on table "public"."interview_qas" to "authenticated";

grant references on table "public"."interview_qas" to "authenticated";

grant select on table "public"."interview_qas" to "authenticated";

grant trigger on table "public"."interview_qas" to "authenticated";

grant truncate on table "public"."interview_qas" to "authenticated";

grant update on table "public"."interview_qas" to "authenticated";

grant delete on table "public"."interview_qas" to "postgres";

grant insert on table "public"."interview_qas" to "postgres";

grant references on table "public"."interview_qas" to "postgres";

grant select on table "public"."interview_qas" to "postgres";

grant trigger on table "public"."interview_qas" to "postgres";

grant truncate on table "public"."interview_qas" to "postgres";

grant update on table "public"."interview_qas" to "postgres";

grant delete on table "public"."interview_qas" to "service_role";

grant insert on table "public"."interview_qas" to "service_role";

grant references on table "public"."interview_qas" to "service_role";

grant select on table "public"."interview_qas" to "service_role";

grant trigger on table "public"."interview_qas" to "service_role";

grant truncate on table "public"."interview_qas" to "service_role";

grant update on table "public"."interview_qas" to "service_role";

grant delete on table "public"."resumes" to "anon";

grant insert on table "public"."resumes" to "anon";

grant references on table "public"."resumes" to "anon";

grant select on table "public"."resumes" to "anon";

grant trigger on table "public"."resumes" to "anon";

grant truncate on table "public"."resumes" to "anon";

grant update on table "public"."resumes" to "anon";

grant delete on table "public"."resumes" to "authenticated";

grant insert on table "public"."resumes" to "authenticated";

grant references on table "public"."resumes" to "authenticated";

grant select on table "public"."resumes" to "authenticated";

grant trigger on table "public"."resumes" to "authenticated";

grant truncate on table "public"."resumes" to "authenticated";

grant update on table "public"."resumes" to "authenticated";

grant delete on table "public"."resumes" to "postgres";

grant insert on table "public"."resumes" to "postgres";

grant references on table "public"."resumes" to "postgres";

grant select on table "public"."resumes" to "postgres";

grant trigger on table "public"."resumes" to "postgres";

grant truncate on table "public"."resumes" to "postgres";

grant update on table "public"."resumes" to "postgres";

grant delete on table "public"."resumes" to "service_role";

grant insert on table "public"."resumes" to "service_role";

grant references on table "public"."resumes" to "service_role";

grant select on table "public"."resumes" to "service_role";

grant trigger on table "public"."resumes" to "service_role";

grant truncate on table "public"."resumes" to "service_role";

grant update on table "public"."resumes" to "service_role";

grant delete on table "public"."skill_gaps" to "anon";

grant insert on table "public"."skill_gaps" to "anon";

grant references on table "public"."skill_gaps" to "anon";

grant select on table "public"."skill_gaps" to "anon";

grant trigger on table "public"."skill_gaps" to "anon";

grant truncate on table "public"."skill_gaps" to "anon";

grant update on table "public"."skill_gaps" to "anon";

grant delete on table "public"."skill_gaps" to "authenticated";

grant insert on table "public"."skill_gaps" to "authenticated";

grant references on table "public"."skill_gaps" to "authenticated";

grant select on table "public"."skill_gaps" to "authenticated";

grant trigger on table "public"."skill_gaps" to "authenticated";

grant truncate on table "public"."skill_gaps" to "authenticated";

grant update on table "public"."skill_gaps" to "authenticated";

grant delete on table "public"."skill_gaps" to "postgres";

grant insert on table "public"."skill_gaps" to "postgres";

grant references on table "public"."skill_gaps" to "postgres";

grant select on table "public"."skill_gaps" to "postgres";

grant trigger on table "public"."skill_gaps" to "postgres";

grant truncate on table "public"."skill_gaps" to "postgres";

grant update on table "public"."skill_gaps" to "postgres";

grant delete on table "public"."skill_gaps" to "service_role";

grant insert on table "public"."skill_gaps" to "service_role";

grant references on table "public"."skill_gaps" to "service_role";

grant select on table "public"."skill_gaps" to "service_role";

grant trigger on table "public"."skill_gaps" to "service_role";

grant truncate on table "public"."skill_gaps" to "service_role";

grant update on table "public"."skill_gaps" to "service_role";


  create policy "Enable delete for users based on user_id"
  on "public"."coaching_sessions"
  as permissive
  for delete
  to public
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable insert for users based on user_id"
  on "public"."coaching_sessions"
  as permissive
  for insert
  to public
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable users to view their own data only"
  on "public"."coaching_sessions"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable delete for users based on user_id"
  on "public"."cv_reviews"
  as permissive
  for delete
  to public
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable insert for users based on user_id"
  on "public"."cv_reviews"
  as permissive
  for insert
  to public
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable users to view their own data only"
  on "public"."cv_reviews"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "update for user_id only"
  on "public"."cv_reviews"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable delete for users based on user_id"
  on "public"."interview"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable insert for users based on user_id"
  on "public"."interview"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable users to view their own data only"
  on "public"."interview"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "update interview for authenticated users only"
  on "public"."interview"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable delete for users based on user_id"
  on "public"."interview_qas"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable insert for users based on user_id"
  on "public"."interview_qas"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable users to view their own data only"
  on "public"."interview_qas"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "update interview_qas for user id"
  on "public"."interview_qas"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable delete for users based on user_id"
  on "public"."resumes"
  as permissive
  for delete
  to public
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable insert for users based on user_id"
  on "public"."resumes"
  as permissive
  for insert
  to public
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable users to view their own data only"
  on "public"."resumes"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable delete for users based on user_id"
  on "public"."skill_gaps"
  as permissive
  for delete
  to public
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable insert for users based on user_id"
  on "public"."skill_gaps"
  as permissive
  for insert
  to public
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable users to view their own data only"
  on "public"."skill_gaps"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "update rows"
  on "public"."skill_gaps"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Give users authenticated access to folder 1va6avm_0"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'uploads'::text) AND ((storage.foldername(name))[1] = 'private'::text) AND (auth.role() = 'authenticated'::text)));



  create policy "Give users authenticated access to folder 1va6avm_1"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'uploads'::text) AND ((storage.foldername(name))[1] = 'private'::text) AND (auth.role() = 'authenticated'::text)));



  create policy "Give users authenticated access to folder 1va6avm_2"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'uploads'::text) AND ((storage.foldername(name))[1] = 'private'::text) AND (auth.role() = 'authenticated'::text)));



  create policy "Give users authenticated access to folder 1va6avm_3"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'uploads'::text) AND ((storage.foldername(name))[1] = 'private'::text) AND (auth.role() = 'authenticated'::text)));



  create policy "Users can list their own resumes"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'uploads'::text) AND ((storage.foldername(name))[1] = 'resumes'::text) AND ((storage.foldername(name))[2] = (auth.uid())::text)));



  create policy "Users can upload to their own folder"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'uploads'::text) AND ((storage.foldername(name))[1] = 'resumes'::text) AND ((storage.foldername(name))[2] = (auth.uid())::text)));



