import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col flex-1 w-full justify-center items-center">
      <Loader className="animate-spin" />
    </div>
  );
}
