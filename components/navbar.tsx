import Link from "next/link";
import { Suspense } from "react";
import { ThemeSwitcher } from "./theme-switcher";
import { AuthButton } from "./auth-button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-20 w-full flex justify-center border-b border-b-foreground/10 backdrop-blur-lg">
      <div className="w-full max-w-5xl flex justify-between items-center p-5">
        <div className="flex gap-5 items-center font-semibold text-lg">
          <Link href={"/"}>Coach.ai</Link>
        </div>

        <div className="flex items-center w-fit gap-3">
          <Suspense>
            <AuthButton />
          </Suspense>

          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
