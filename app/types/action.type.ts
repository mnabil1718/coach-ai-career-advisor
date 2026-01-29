export type ActionResult<T> = {
    success: true; error: null; data?: T
} | { success: false; error: string }