import { getCurrentUser } from "@/services/auth/user.service";
import { getSessions } from "@/services/sessions/sessions.service";
import { SessionHistoryItem } from "./session-history-item";

export async function SessionHistory() {
    const { data: user } = await getCurrentUser();

    if (!user) throw new Error("Action not allowed");

    const { data: sessions } = await getSessions();

    if (!sessions || sessions.length < 1) {
        return (
            <div className="w-full flex justify-center">
                <p className="text-sm text-muted-foreground">
                    You have no session yet.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-3">
            <h2 className="text-lg font-medium">Recent Sessions</h2>
            <ul className="flex flex-col w-full divide-y">
                {sessions.map((s, i) => {
                    return <SessionHistoryItem key={i} session={s} />;
                })}
            </ul>
        </div>
    );
}
