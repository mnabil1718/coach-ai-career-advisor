import { nanoid } from "nanoid";

export function generateUniqueFileName(file: File): string {
    const id = nanoid(6); // prevent duplicates
    const base = file.name.split(".")[0];
    const ext = file.name.split(".")[1];
    const filename = `${base}-${id}.${ext}`;

    return filename
}