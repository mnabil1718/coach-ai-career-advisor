import { validateData } from "@/utils/parse";
import { getCVReview } from "../cv_reviews/reviews.service";
import { ParseResumeSchema, ParseResumeSchemaType } from "@/schema/resume.schema";
import { getInterviewBySessionId, getQuestionAnswer } from "./interview.service";
import { AnswerSchemaType, FeedbackSchemaType, Interview, QuestionSchemaType } from "@/types/interview.type";
import { AnswerSchema, FeedbackSchema, QuestionSchema } from "@/schema/interview.schema";

// export async function mockFetcher(sessionId: string, step?: number, interviewId: string | string[] | undefined) {

//     if (Array.isArray(step)) {
//         throw new Error("Invalid step");
//     }

//     if (Array.isArray(interviewId)) {
//         throw new Error("invalid interview id");
//     }

//     if (!interviewId) {
//         return { sessionId:  }
//     }


//     switch (Number)
//     const { data: review } = await getCVReview(sessionId);
//     console.log("REVIEW FETCHED");

//     const parsedCV = validateData<ParseResumeSchemaType>(
//         ParseResumeSchema,
//         review!.parsed_content,
//     );

//   const { data: itv } = await getInterviewBySessionId(sessionId);
//   console.log("ITV FETCHED");

//   if (!itv) return <MockStarter sessionId={sessionId} parsedCV={parsedCV} />;

//   const { data: qa } = await getQuestionAnswer(itv!.id, itv!.step);
//   console.log("QA FETCHED");

//   let feedback: FeedbackSchemaType | undefined = undefined;
//   let answer: AnswerSchemaType | undefined = undefined;

//   const question = validateData<QuestionSchemaType>(QuestionSchema, {
//     question: qa!.question,
//     type: qa!.type,
//     sequence: qa!.step,
//   });

//   if (qa?.feedback) {
//     feedback = validateData<FeedbackSchemaType>(FeedbackSchema, qa!.feedback);
//   }

//   if (qa?.answer) {
//     answer = validateData<AnswerSchemaType>(AnswerSchema, qa!.answer);
//   }

//   if (
//     !step ||
//     !interviewId ||
//     Number(step) !== itv.step ||
//     itv.id !== interviewId
//   ) {
//     const p = new URLSearchParams();

//     p.set("step", String(itv.step));

//     p.set("interviewId", itv.id);

//     redirect(`/sessions/${sessionId}/mock?${p.toString()}`);
//   }
// }


// step is 0 (starter)
export async function starterFetcher(sessionId: 
    string, step: number, 
    interviewId: string | string[] | undefined)
    : Promise<{ sessionId: string, parsedCV: ParseResumeSchemaType }> {
    if (Array.isArray(interviewId)) {
        throw new Error("Invalid interview id");
    }

    const { data: review } = await getCVReview(sessionId);

    const parsedCV = validateData<ParseResumeSchemaType>(
        ParseResumeSchema,
        review!.parsed_content,
    );

    return { sessionId, parsedCV };
}

// step is decimal (feedback)
export async function feedbackFetcher(sessionId: string, 
    step: number, 
    interviewId: string | string[] | undefined)
    : Promise<{ step: number, feedback: FeedbackSchemaType | undefined, interview: Interview | null | undefined }> {

    if (Array.isArray(interviewId)) {
        throw new Error("Invalid interview id");
    }

    let feedback: FeedbackSchemaType | undefined = undefined;

    const { data: itv } = await getInterviewBySessionId(sessionId);

    const { data: qa } = await getQuestionAnswer(itv!.id, step - 0.5);

    if (qa?.feedback) {
        feedback = validateData<FeedbackSchemaType>(FeedbackSchema, qa?.feedback);
    }

    return { step, feedback, interview: itv };
}

// step is > 0 and whole (question)
export async function questionFetcher(sessionId: string, step: number, interviewId: string | string[] | undefined): Promise<{
    interview: Interview,
    question: QuestionSchemaType,
    answer: AnswerSchemaType,
    feedback?: FeedbackSchemaType,
}> {

        if (Array.isArray(interviewId)) {
        throw new Error("Invalid interview id");
    }
    
    const { data: itv } = await getInterviewBySessionId(sessionId);

    const { data: qa } = await getQuestionAnswer(itv!.id, step);

    const question = validateData<QuestionSchemaType>(QuestionSchema, {
        type: qa!.type,
        question: qa!.question,
        sequence: qa!.step,
    });

    let answer: AnswerSchemaType = null;

    if (qa?.answer) {
        answer = validateData<AnswerSchemaType>(AnswerSchema, qa.answer);
    }

    let feedback: FeedbackSchemaType | undefined = undefined;

        if (qa?.feedback) {
        feedback = validateData<FeedbackSchemaType>(FeedbackSchema, qa?.feedback);
    }

    return {
        interview: itv!,
        question,
        answer,
        feedback,
    };

}