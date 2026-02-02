import { Tables } from "@/database.types";
import { ParseResumeResponseType } from "@/schema/resume.schema";

export type CVReview = Tables<"cv_reviews">;

export type CreateSessionPayload = {
    session_id: string;
    resume_id: string;
    parsed_content: ParseResumeResponseType;
}