import { toastError } from "./toast"

// a try catch is unavoidable in next.js rendering, therefore
// we need to abstract try-catch boiler to avoid 
// littering every actions in components.
export async function tryCatchWrapper<T>(
    cb: () => Promise<T>,
    toastId?: string,
): Promise<T | null> {
    try {
        return await cb()
    } catch (err) {
        const m = err instanceof Error ? err.message : "Something went wrong"
        toastError(m, undefined, toastId)
        return null
    }
}
