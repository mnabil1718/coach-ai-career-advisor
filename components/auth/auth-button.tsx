import Link from "next/link";
import { Button } from "../ui/button";
import { LogoutButton } from "./logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/utils/name";
import { getCurrentUser } from "@/services/auth/user.service";
import { DashboardButton } from "./dashboard-button";

export async function AuthButton() {
  const { data: user } = await getCurrentUser();

  return user ? (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
        <AvatarFallback>{getInitials(user.user_metadata?.name)}</AvatarFallback>
      </Avatar>
      <DashboardButton />
      <LogoutButton />
    </div>
  ) : (
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
