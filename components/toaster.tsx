"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

export function Toaster() {
  const { resolvedTheme } = useTheme();
  return (
    <SonnerToaster
      theme={resolvedTheme as ToasterProps["theme"]}
      duration={4000}
      richColors
      visibleToasts={1}
    />
  );
}
