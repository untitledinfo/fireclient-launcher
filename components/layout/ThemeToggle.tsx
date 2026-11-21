"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Theme = "dark" | "light";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const isLight = document.documentElement.classList.contains("light");
    setTheme(isLight ? "light" : "dark");
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.toggle("light", next === "light");
    root.dataset.theme = next;
    root.style.colorScheme = next;
    try {
      localStorage.setItem("fc-theme", next);
    } catch {
      /* storage can be unavailable in private modes — theme still applies for the session */
    }
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      aria-pressed={theme === "light"}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-[3px] border border-lineStrong bg-surface text-inkSoft transition-colors hover:border-fire/45 hover:text-fire",
        className,
      )}
    >
      <Sun
        className={cn(
          "absolute h-4 w-4 transition-all duration-300",
          mounted && theme === "light" ? "rotate-0 opacity-100" : "-rotate-90 opacity-0",
        )}
        aria-hidden
      />
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-all duration-300",
          mounted && theme === "light" ? "rotate-90 opacity-0" : "rotate-0 opacity-100",
        )}
        aria-hidden
      />
    </button>
  );
}
