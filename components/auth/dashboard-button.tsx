"use client";

import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import Link from "next/link";

export function DashboardButton() {
  const pathname = usePathname();

  if (pathname === "/") {
    return (
      <Link href={"/dashboard"}>
        <Button variant={"outline"}>Go to dashboard</Button>
      </Link>
    );
  }
}
