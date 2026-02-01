"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types/action.type";

export async function getSignedURL(bucketName: string, path: string): Promise<ActionResult<string>> {
    const supabase = await createClient();

    // Remove the bucket name from the start of the path
    // Example: 'uploads/resumes/file.pdf' -> 'resumes/file.pdf'
    const relativePath = path.replace(`${bucketName}/`, "");

    const { data, error } = await supabase.storage.from(bucketName).createSignedUrl(relativePath, 60 * 60) // 1hr

    if (error) throw error;

    return { data: data.signedUrl };
}


export async function downloadFile(bucketName: string, path: string): Promise<ActionResult<Blob>> {
    const supabase = await createClient();

    const relativePath = path.replace(`${bucketName}/`, "");

    const { data, error } = await supabase.storage.from(bucketName).download(relativePath);

    if (error) throw error;

    return { data: data! };
}