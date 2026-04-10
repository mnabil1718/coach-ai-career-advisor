"use client"

import { Button } from "@/components/ui/button"
import { updateSessionStatus } from "@/services/sessions/sessions.service";
import { useRouter } from "nextjs-toploader/app"

export interface FinishButtonProps {
    id: string;
}

export function FinishButton({ id }: FinishButtonProps) {
    const router = useRouter()

    const finish = async () => {
        await updateSessionStatus(id, "COMPLETED");
        router.push("/dashboard");
    }

    return <Button type="button" onClick={finish} className="font-semibold px-4 py-2 rounded-full">
        Finish Session
    </Button>

}
