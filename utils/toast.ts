import { toast } from "sonner";

export type ToastPosition = "bottom-center" | "bottom-left" | "bottom-right" | "top-center" | "top-left" | "top-right";

// timer global
let toastInterval: NodeJS.Timeout | null = null;

export function toastLoading(msg: string, dir: ToastPosition = "top-center", id: string, showTimer = false) {
    if (toastInterval) clearInterval(toastInterval);

    if (!showTimer) {
        toast.loading(msg, { id, position: dir });
        return;
    }

    let seconds = 0;
    
    toast.loading(`${msg}       (${seconds}s)`, { id, position: dir });

    toastInterval = setInterval(() => {
        seconds++;
        toast.loading(`${msg} (${seconds}s)`, {
            id,
            position: dir,
        });
    }, 1000);
}


export function toastError(msg: string, dir: ToastPosition = "top-center", id?: string) {
    if (toastInterval) clearInterval(toastInterval);
    toast.error(msg, {
        id,
        position: dir,
        className: "bg-red-700/70! backdrop-blur-md! border!",
    });
}

export function toastSuccess(msg: string, dir: ToastPosition = "top-center", id?: string) {
    if (toastInterval) clearInterval(toastInterval);
    toast.success(msg, {
        id,
        position: dir,
        className: "bg-slate-700/70! backdrop-blur-md! border!",
    });
}