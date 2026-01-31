import Link from "next/link";
import { Button } from "../ui/button";
import { getCurrentUser } from "@/services/auth/user.service";
import { DashboardButton } from "./dashboard-button";
import { Profile } from "../profile";

export async function AuthButton() {
  const { data: user } = await getCurrentUser();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <DashboardButton />
        <Profile user={user} />
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Button asChild variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
