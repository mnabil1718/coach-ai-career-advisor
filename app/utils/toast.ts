import { toast } from "sonner";

export type ToastPosition = "bottom-center" | "bottom-left" | "bottom-right" | "top-center" | "top-left" | "top-right";

export function toastError(msg: string, dir: ToastPosition = "top-center") {
    toast.error(msg, {
            position: dir,
            className: "bg-red-700/70! backdrop-blur-md! border!",
            cancel: {
                label: 'Dismiss',
                onClick: () => {},
            }
        });
}


export function toastSuccess(msg: string, dir: ToastPosition = "top-center") {
    toast.success(msg, {
        position: dir,
        className: "bg-slate-700/70! backdrop-blur-md! border!",
        cancel: {
                label: 'Dismiss',
                onClick: () => {},
            }
    });
}