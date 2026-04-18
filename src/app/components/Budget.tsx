import { useState } from "react";
import { useExpense, Category } from "../context/ExpenseContext";
import { useApp } from "../context/AppContext";
import { CATEGORY_COLORS, CategoryIcon } from "./CategoryIcon";
import { formatINR } from "../utils/formatINR";
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";
import { Check, AlertTriangle } from "lucide-react";

const budgetableCategories: Category[] = [
  "Food & Dining", "Transport", "Shopping", "Entertainment",
  "Health", "Housing", "Education", "Travel",
];

export function Budget() {
  const { transactions, budgets, updateBudget } = useExpense();
  const { theme } = useApp();
  const dark = theme === "dark";
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editValue, setEditValue] = useState("");

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const thisMonthExpenses = transactions.filter(
    (t) =>
      t.type === "expense" &&
      isWithinInterval(parseISO(t.date), { start: monthStart, end: monthEnd })
  );

  const spentByCategory = thisMonthExpenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleEdit = (category: Category, current: number) => {
    setEditingCategory(category);
    setEditValue(current.toString());
  };

  const handleSave = (category: Category) => {
    const val = parseFloat(editValue);
    if (!isNaN(val) && val > 0) {
      updateBudget(category, val);
    }
    setEditingCategory(null);
    setEditValue("");
  };

  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgetableCategories.reduce((s, c) => s + (spentByCategory[c] || 0), 0);
  const remaining = totalBudget - totalSpent;
  const pctUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const cardCls = `bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800`;

  return (
    <div className="p-6 space-y-5 bg-[#f5f6fa] dark:bg-gray-950 min-h-full">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 dark:text-gray-100" style={{ fontWeight: 700, fontSize: "1.4rem" }}>Budget</h1>
        <p className="text-gray-400 dark:text-gray-500 mt-0.5" style={{ fontSize: "0.85rem" }}>
          Set & track your monthly spending limits
        </p>
      </div>

      {/* Overall */}
      <div className="bg-cyan-600 rounded-2xl p-5 text-white shadow-lg shadow-cyan-200 dark:shadow-cyan-900/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-cyan-200" style={{ fontSize: "0.8rem" }}>Total Monthly Budget</p>
            <p className="text-white mt-1" style={{ fontWeight: 700, fontSize: "1.8rem" }}>
              {formatINR(totalBudget)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-cyan-200" style={{ fontSize: "0.8rem" }}>Spent So Far</p>
            <p className="text-white mt-1" style={{ fontWeight: 700, fontSize: "1.8rem" }}>
              {formatINR(totalSpent)}
            </p>
          </div>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              pctUsed > 90 ? "bg-rose-300" : pctUsed > 70 ? "bg-yellow-300" : "bg-white"
            }`}
            style={{ width: `${Math.min(pctUsed, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-cyan-200" style={{ fontSize: "0.75rem" }}>
            {formatINR(remaining)} remaining
          </span>
          <span className="text-cyan-200" style={{ fontSize: "0.75rem" }}>
            {pctUsed.toFixed(0)}% used
          </span>
        </div>
      </div>

      {/* Category budgets */}
      <div className="space-y-3">
        {budgetableCategories.map((category) => {
          const budget = budgets.find((b) => b.category === category);
          const limit = budget?.limit || 0;
          const spent = spentByCategory[category] || 0;
          const pct = limit > 0 ? (spent / limit) * 100 : 0;
          const isOver = pct > 100;
          const isNear = pct > 80 && !isOver;
          const color = CATEGORY_COLORS[category] || "#6b7280";
          const isEditing = editingCategory === category;

          return (
            <div key={category} className={cardCls + " p-4"}>
              <div className="flex items-center gap-3 mb-3">
                <CategoryIcon category={category} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-800 dark:text-gray-200" style={{ fontSize: "0.875rem", fontWeight: 600 }}>{category}</p>
                    <div className="flex items-center gap-2">
                      {isOver && (
                        <div className="flex items-center gap-1 text-rose-500 bg-rose-50 dark:bg-rose-900/30 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          <span style={{ fontSize: "0.7rem", fontWeight: 600 }}>Over budget!</span>
                        </div>
                      )}
                      {isNear && (
                        <div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          <span style={{ fontSize: "0.7rem", fontWeight: 600 }}>Near limit</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(pct, 100)}%`,
                    backgroundColor: isOver ? "#f43f5e" : isNear ? "#f59e0b" : color,
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400" style={{ fontSize: "0.78rem" }}>
                  <span style={{ fontWeight: 600, color: isOver ? "#f43f5e" : dark ? "#e5e7eb" : "#374151" }}>
                    {formatINR(spent)}
                  </span>
                  {" / "}
                  {isEditing ? (
                    <span className="inline-flex items-center gap-1">
                      <span>₹</span>
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSave(category);
                          if (e.key === "Escape") setEditingCategory(null);
                        }}
                        autoFocus
                        className={`w-24 border-b focus:outline-none ${
                          dark
                            ? "border-cyan-500 bg-transparent text-cyan-400"
                            : "border-cyan-400 text-cyan-600"
                        }`}
                        style={{ fontSize: "0.78rem", fontWeight: 600 }}
                      />
                    </span>
                  ) : (
                    <span>{formatINR(limit)}</span>
                  )}
                </span>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "0.72rem", color: isOver ? "#f43f5e" : dark ? "#6b7280" : "#94a3b8" }}>
                    {pct.toFixed(0)}%
                  </span>
                  {isEditing ? (
                    <button
                      onClick={() => handleSave(category)}
                      className="w-6 h-6 bg-cyan-100 dark:bg-cyan-900/50 rounded-lg flex items-center justify-center hover:bg-cyan-200 dark:hover:bg-cyan-800 transition"
                    >
                      <Check className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(category, limit)}
                      className="text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition"
                      style={{ fontSize: "0.72rem", fontWeight: 600 }}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
