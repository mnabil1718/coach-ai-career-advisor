"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/services/auth/logout.service";
import { getInitials } from "@/utils/name";
import { toastError } from "@/utils/toast";
import { JwtPayload } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export function Profile({ user }: { user: JwtPayload }) {
  const router = useRouter();

  const logoutHandler = async () => {
    const { error } = await logout();
    if (error) {
      toastError(error);
      return;
    }

    router.push("/auth/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar>
          <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
          <AvatarFallback>
            {getInitials(user.user_metadata?.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={logoutHandler}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
