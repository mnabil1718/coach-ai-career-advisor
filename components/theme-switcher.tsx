"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ICON_SIZE, ICON_STROKE_WIDTH } from "@/constants/theme";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"}>
          <RenderIcon theme={theme} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-content" align="start">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(e) => setTheme(e)}
        >
          <DropdownMenuRadioItem
            className="flex gap-2 cursor-pointer"
            value="light"
          >
            <Sun
              size={ICON_SIZE}
              strokeWidth={ICON_STROKE_WIDTH}
              className="text-muted-foreground"
            />{" "}
            <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            className="flex gap-2 cursor-pointer"
            value="dark"
          >
            <Moon
              size={ICON_SIZE}
              strokeWidth={ICON_STROKE_WIDTH}
              className="text-muted-foreground"
            />{" "}
            <span>Dark</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            className="flex gap-2 cursor-pointer"
            value="system"
          >
            <Laptop
              size={ICON_SIZE}
              strokeWidth={ICON_STROKE_WIDTH}
              className="text-muted-foreground"
            />{" "}
            <span>System</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function RenderIcon({ theme }: { theme: string | undefined }) {
  if (theme === "light") {
    return (
      <Sun
        key="light"
        strokeWidth={ICON_STROKE_WIDTH}
        className={"text-muted-foreground"}
      />
    );
  } else if (theme === "dark") {
    return (
      <Moon
        key="dark"
        strokeWidth={ICON_STROKE_WIDTH}
        className={"text-muted-foreground"}
      />
    );
  } else {
    return (
      <Laptop
        key="system"
        strokeWidth={ICON_STROKE_WIDTH}
        className={"text-muted-foreground"}
      />
    );
  }
}

export { ThemeSwitcher };
