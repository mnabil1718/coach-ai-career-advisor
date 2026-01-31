"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { toastError } from "@/utils/toast";
import { ERROR_MESSAGES } from "@/constants/search-params";

export function SearchParamsListener() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const errorKey = searchParams.get("error");

    if (errorKey && ERROR_MESSAGES[errorKey]) {
      toastError(ERROR_MESSAGES[errorKey]);

      // clean up
      const params = new URLSearchParams(searchParams.toString());
      params.delete("error");

      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;

      window.history.replaceState(null, "", newUrl);
    }
  }, [searchParams, pathname]);

  return null;
}
