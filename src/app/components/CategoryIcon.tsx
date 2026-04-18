import {
  Utensils, Car, ShoppingBag, Film, Heart, Home, BookOpen,
  Plane, Briefcase, Code, TrendingUp, HelpCircle,
} from "lucide-react";
import { Category } from "../context/ExpenseContext";

const categoryConfig: Record<
  Category,
  { icon: React.ElementType; color: string; bg: string; darkBg: string }
> = {
  "Food & Dining":  { icon: Utensils,    color: "text-orange-500", bg: "bg-orange-50",  darkBg: "dark:bg-orange-900/20"  },
  "Transport":      { icon: Car,          color: "text-blue-500",   bg: "bg-blue-50",    darkBg: "dark:bg-blue-900/20"    },
  "Shopping":       { icon: ShoppingBag,  color: "text-pink-500",   bg: "bg-pink-50",    darkBg: "dark:bg-pink-900/20"    },
  "Entertainment":  { icon: Film,         color: "text-purple-500", bg: "bg-purple-50",  darkBg: "dark:bg-purple-900/20"  },
  "Health":         { icon: Heart,        color: "text-rose-500",   bg: "bg-rose-50",    darkBg: "dark:bg-rose-900/20"    },
  "Housing":        { icon: Home,         color: "text-teal-500",   bg: "bg-teal-50",    darkBg: "dark:bg-teal-900/20"    },
  "Education":      { icon: BookOpen,     color: "text-amber-500", bg: "bg-amber-50",  darkBg: "dark:bg-amber-900/20"  },
  "Travel":         { icon: Plane,        color: "text-sky-500",    bg: "bg-sky-50",     darkBg: "dark:bg-sky-900/20"     },
  "Salary":         { icon: Briefcase,    color: "text-emerald-500",bg: "bg-emerald-50", darkBg: "dark:bg-emerald-900/20" },
  "Freelance":      { icon: Code,         color: "text-cyan-500", bg: "bg-cyan-50",  darkBg: "dark:bg-cyan-900/20"  },
  "Investment":     { icon: TrendingUp,   color: "text-green-500",  bg: "bg-green-50",   darkBg: "dark:bg-green-900/20"   },
  "Other":          { icon: HelpCircle,   color: "text-gray-500",   bg: "bg-gray-50",    darkBg: "dark:bg-gray-800"       },
};

export const CATEGORY_COLORS: Record<string, string> = {
  "Food & Dining":  "#f97316",
  "Transport":      "#3b82f6",
  "Shopping":       "#ec4899",
  "Entertainment":  "#a855f7",
  "Health":         "#f43f5e",
  "Housing":        "#14b8a6",
  "Education":      "#6366f1",
  "Travel":         "#0ea5e9",
  "Salary":         "#10b981",
  "Freelance":      "#8b5cf6",
  "Investment":     "#22c55e",
  "Other":          "#6b7280",
};

interface Props {
  category: Category;
  size?: "sm" | "md";
}

export function CategoryIcon({ category, size = "md" }: Props) {
  const config = categoryConfig[category] || categoryConfig["Other"];
  const Icon = config.icon;
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const boxSize = size === "sm" ? "w-7 h-7" : "w-9 h-9";

  return (
    <div className={`${boxSize} ${config.bg} ${config.darkBg} rounded-xl flex items-center justify-center shrink-0`}>
      <Icon className={`${iconSize} ${config.color}`} />
    </div>
  );
}
