"use client";

import { toastError } from "@/utils/toast";
import { useEffect } from "react";

export function ErrorHandler({ message }: { message: string }) {
  useEffect(() => {
    toastError(message);
  }, [message]);

  return null;
}
