"use server";

if (typeof window === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.DOMMatrix = class DOMMatrix {};
}

import { ActionResult } from "@/types/action.type";
import officeParser from "officeparser";

export async function parseFromArrayBuffer(file: Blob): Promise<ActionResult<string>> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    // const buffer = Buffer.from(arrayBuffer);
    const ast = await officeParser.parseOffice(arrayBuffer);

    return { data: ast.toText() };

  } catch (err: unknown) {

    if (err instanceof Error) {
        throw err;
    }

    throw new Error("Something went wrong");
  }
}