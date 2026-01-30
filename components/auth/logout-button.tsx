"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { logout } from "@/services/auth/logout.service";
import { toastError } from "@/utils/toast";

export function LogoutButton() {
  const router = useRouter();

  const logoutHandler = async () => {
    const { error } = await logout();
    if (error) {
      toastError(error);
      return;
    }

    router.push("/auth/login");
  };

  return <Button onClick={logoutHandler}>Logout</Button>;
}
