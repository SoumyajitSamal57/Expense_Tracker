import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet } from "react-router";
import {
  LayoutDashboard, ArrowLeftRight, BarChart3, Target,
  Wallet, Sun, Moon, Pencil, Check, X,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/budget", label: "Budget", icon: Target },
];

export function Layout() {
  const { theme, toggleTheme, userName, userInitials, setUserName } = useApp();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingName) {
      setNameInput(userName);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [editingName, userName]);

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed) setUserName(trimmed);
    setEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSaveName();
    if (e.key === "Escape") setEditingName(false);
  };

  return (
    <div className={`${theme === "dark" ? "dark" : ""} flex h-screen overflow-hidden`}>
      <div className="flex h-full w-full bg-[#f5f6fa] dark:bg-gray-950 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col shrink-0 shadow-sm">
          {/* Logo */}
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white leading-none" style={{ fontWeight: 700, fontSize: "1rem" }}>
                    SpendWise
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 leading-none mt-0.5" style={{ fontSize: "0.7rem" }}>
                    Expense Tracker
                  </p>
                </div>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-gray-100 dark:bg-gray-800 hover:bg-violet-100 dark:hover:bg-violet-900/40 text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400"
                title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              >
                {theme === "light" ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            <p
              className="text-gray-400 dark:text-gray-600 uppercase px-3 mb-2"
              style={{ fontSize: "0.65rem", letterSpacing: "0.1em", fontWeight: 600 }}
            >
              Menu
            </p>
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                    isActive
                      ? "bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isActive ? "bg-violet-100 dark:bg-violet-900/50" : "bg-transparent"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? "text-violet-600 dark:text-violet-400" : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                    </div>
                    <span style={{ fontSize: "0.875rem", fontWeight: isActive ? 600 : 500 }}>
                      {label}
                    </span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User Profile */}
          <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
            {editingName ? (
              <div className="flex items-center gap-2 px-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white shrink-0" style={{ fontSize: "0.7rem", fontWeight: 700 }}>
                  {userInitials}
                </div>
                <input
                  ref={inputRef}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={30}
                  className="flex-1 min-w-0 bg-gray-50 dark:bg-gray-800 border border-violet-300 dark:border-violet-600 rounded-lg px-2 py-1 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-300"
                  style={{ fontSize: "0.8rem" }}
                />
                <button
                  onClick={handleSaveName}
                  className="w-6 h-6 bg-violet-100 dark:bg-violet-900/50 rounded-md flex items-center justify-center hover:bg-violet-200 dark:hover:bg-violet-800 transition shrink-0"
                >
                  <Check className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                </button>
                <button
                  onClick={() => setEditingName(false)}
                  className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition shrink-0"
                >
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 px-2 group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white shrink-0" style={{ fontSize: "0.7rem", fontWeight: 700 }}>
                  {userInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 dark:text-gray-100 truncate" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                    {userName}
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 truncate" style={{ fontSize: "0.7rem" }}>
                    Personal Account
                  </p>
                </div>
                <button
                  onClick={() => setEditingName(true)}
                  className="w-6 h-6 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 bg-gray-100 dark:bg-gray-800 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition shrink-0"
                  title="Edit name"
                >
                  <Pencil className="w-3 h-3 text-gray-400 hover:text-violet-500" />
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
