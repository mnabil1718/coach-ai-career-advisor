import { getCurrentUser } from "@/services/auth/user.service";

export async function Greeting() {
  const { data: user } = await getCurrentUser();

  return (
    <h2 className="font-semibold text-2xl">
      Welcome,{" "}
      {user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "User"}
    </h2>
  );
}
