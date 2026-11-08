import { createContext, useContext, useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";

type Theme = "light" | "dark" | "system";
const STORAGE_KEY = "kodarcrystal:theme";

type Ctx = {
  theme: Theme;
  resolved: "light" | "dark";
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

const ThemeContext = createContext<Ctx>({
  theme: "system",
  resolved: "light",
  setTheme: () => {},
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [theme, setThemeState] = useState<Theme>("dark");
  const [resolved, setResolved] = useState<"light" | "dark">("dark");

  // Load persisted manual choice after hydration.
  useEffect(() => {
    const saved = readStorage(STORAGE_KEY);
    if (saved === "light" || saved === "dark" || saved === "system") setThemeState(saved);
    setHydrated(true);
  }, []);

  // Resolve against system preference and keep in sync.
  useEffect(() => {
    if (!hydrated) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const next: "light" | "dark" = theme === "system" ? (mq.matches ? "dark" : "light") : theme;
      setResolved(next);
      document.documentElement.classList.toggle("dark", next === "dark");
      document.documentElement.style.colorScheme = next;
    };
    apply();
    if (theme === "system") {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [theme, hydrated]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    writeStorage(STORAGE_KEY, t);
  };

  const toggle = () => setTheme(resolved === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Runs before hydration to avoid a flash of the wrong theme. */
export const themeInitScript = `(function(){try{var s=localStorage.getItem("${STORAGE_KEY}");var d=s==="system"?window.matchMedia("(prefers-color-scheme: dark)").matches:s!=="light";document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){}})();`;
