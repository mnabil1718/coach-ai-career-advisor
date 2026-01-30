// "use server";

// import { createClient } from "@/lib/supabase/server";
// import { ActionResult } from "@/types/action.type";

// export async function download(
//   bucket: string,
//   path: string,
// ): Promise<ActionResult<Blob | null>> {
//   const supabase = await createClient();

//   const { data, error } = await supabase.storage.from(bucket).download(path);

//   if (error) {
//     // @ts-ignore - Accessing the raw response body if possible
//     const rawError = await (error as any).originalError?.json();
//     console.log("DETAILED ERROR:", rawError);
//     return { error: error.message };
//   }

//   return { data: data, error: null };
// }
