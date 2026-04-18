import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Theme = "light" | "dark";

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  userName: string;
  userInitials: string;
  setUserName: (name: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function getInitials(name: string) {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("sw-theme") as Theme) || "light";
  });
  const [userName, setUserNameState] = useState(() => {
    return localStorage.getItem("sw-username") || "Arjun Sharma";
  });

  useEffect(() => {
    localStorage.setItem("sw-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === "light" ? "dark" : "light"));

  const setUserName = (name: string) => {
    setUserNameState(name);
    localStorage.setItem("sw-username", name);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        userName,
        userInitials: getInitials(userName),
        setUserName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
