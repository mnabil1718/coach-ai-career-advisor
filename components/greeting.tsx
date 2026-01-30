import { getCurrentUser } from "@/services/auth/user.service";

export async function Greeting() {
  const { data: user } = await getCurrentUser();

  return (
    <h2 className="font-semibold text-2xl mb-4">
      Welcome back, {user?.user_metadata?.name ?? "User"}
    </h2>
  );
}
