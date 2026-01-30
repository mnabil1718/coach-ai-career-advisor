"use server";

import { ActionResult } from "@/types/action.type";
import officeParser from "officeparser";

export async function parseFromArrayBuffer(file: Blob): Promise<ActionResult<string>> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    // const buffer = Buffer.from(arrayBuffer);
    const ast = await officeParser.parseOffice(arrayBuffer);

    return { error: null, data: ast.toText() };

  } catch (err: unknown) {

    if (err instanceof Error) {
        return { error: err.message };
    }

    return { error: 'Something went wrong' };
  }
}