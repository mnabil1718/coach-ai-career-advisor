import { Suspense } from "react";
import { ThemeSwitcher } from "./theme-switcher";
import { AuthButton } from "./auth/auth-button";
import { Brand } from "./brand";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-20 w-full flex justify-center border-b border-b-foreground/10 backdrop-blur-lg bg-background/50">
      <div className="w-full max-w-5xl flex justify-between items-center p-5">
        <Brand size="xl" />

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
