"use client"

import { Button } from "@/components/ui/button"
import { updateSessionStage } from "@/services/sessions/sessions.service";
import { useRouter } from "nextjs-toploader/app"

export interface NextButtonProps {
    id: string;
}

export function NextButton({ id }: NextButtonProps) {
    const router = useRouter()

    async function handleNext() {
        await updateSessionStage(id, "MOCK_INTERVIEW");
        router.push(`/sessions/${id}/mock`);
    }

    return <Button onClick={handleNext} type="submit" className="font-semibold">Next: Mock interview</Button>

}
