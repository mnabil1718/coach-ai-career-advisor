import { toast } from "sonner";

export type ToastPosition =
    | "bottom-center"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "top-left"
    | "top-right";

// timer global
let toastInterval: NodeJS.Timeout | null = null;

const stopTimer = () => {
    if (toastInterval) {
        clearInterval(toastInterval)
        toastInterval = null
    }
}

const getTimerAction = (s: number): React.ReactNode => {
    return (
        <button className="pointer-events-none flex flex-1 justify-end font-medium text-muted-foreground">
            {s}s
        </button>
    );
};

export function toastLoading(
    msg: string,
    dir: ToastPosition = "top-right",
    id: string,
    showTimer = false,
) {
    stopTimer()

    if (!showTimer) {
        toast.loading(msg, { id, position: dir });
        return;
    }

    let seconds = 1;

    const options = (seconds: number) => {
        return {
            id,
            position: dir,
            action: getTimerAction(seconds),
        };
    };

    toast.loading(`${msg}`, options(seconds));
    toastInterval = setInterval(() => {
        seconds++;

        if (toastInterval) {
            toast.loading(msg, options(seconds))
        }

    }, 1000);
}

export function toastError(
    msg: string,
    dir: ToastPosition = "top-right",
    id?: string,
) {
    stopTimer();
    toast.error(msg, {
        id,
        position: dir,
        className: "bg-red-700/70! backdrop-blur-md! border!",
    });
}

export function toastSuccess(
    msg: string,
    dir: ToastPosition = "top-right",
    id?: string,
) {
    stopTimer();
    toast.success(msg, {
        id,
        position: dir,
        className: "bg-slate-700/70! backdrop-blur-md! border!",
    });
}
