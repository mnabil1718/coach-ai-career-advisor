import { signInWithGoogle } from "@/app/actions/auth/google";
import { Google } from "@/components/google-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GoogleSignInForm({ className = "" }: { className?: string }) {
  return (
    <form action={signInWithGoogle}>
      <Button
        type="submit"
        variant="outline"
        className={cn("w-full", className)}
      >
        <Google />
        Continue with Google
      </Button>
    </form>
  );
}
