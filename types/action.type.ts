export type ActionResult<T> = {
    data?: T;
    error?: string | null; // optionally able to return error instead of throw
}