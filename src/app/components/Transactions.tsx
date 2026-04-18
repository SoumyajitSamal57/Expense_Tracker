import { useState } from "react";
import { Plus, Search, Trash2, Filter, ArrowUpRight } from "lucide-react";
import { useExpense, Category, TransactionType } from "../context/ExpenseContext";
import { useApp } from "../context/AppContext";
import { AddTransactionModal } from "./AddTransactionModal";
import { CategoryIcon } from "./CategoryIcon";
import { formatINR } from "../utils/formatINR";
import { format, parseISO } from "date-fns";

const allCategories: Category[] = [
  "Food & Dining", "Transport", "Shopping", "Entertainment",
  "Health", "Housing", "Education", "Travel", "Salary",
  "Freelance", "Investment", "Other",
];

export function Transactions() {
  const { transactions, deleteTransaction } = useExpense();
  const { theme } = useApp();
  const dark = theme === "dark";
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | TransactionType>("all");
  const [filterCategory, setFilterCategory] = useState<"all" | Category>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");

  const filtered = transactions
    .filter((t) => {
      if (filterType !== "all" && t.type !== filterType) return false;
      if (filterCategory !== "all" && t.category !== filterCategory) return false;
      if (
        search &&
        !t.description.toLowerCase().includes(search.toLowerCase()) &&
        !t.category.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.date).getTime() - new Date(a.date).getTime();
      return b.amount - a.amount;
    });

  const totalFiltered = filtered.reduce((s, t) => (t.type === "income" ? s + t.amount : s - t.amount), 0);

  const handleDelete = (id: string) => {
    deleteTransaction(id);
  };

  const selectCls = `px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-200 appearance-none ${
    dark
      ? "bg-gray-800 border-gray-700 text-gray-300"
      : "bg-gray-50 border-gray-100 text-gray-500"
  }`;

  return (
    <div className="p-6 space-y-5 bg-[#f5f6fa] dark:bg-gray-950 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-gray-100" style={{ fontWeight: 700, fontSize: "1.4rem" }}>Transactions</h1>
          <p className="text-gray-400 dark:text-gray-500 mt-0.5" style={{ fontSize: "0.85rem" }}>{filtered.length} records</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition shadow-lg shadow-cyan-200 dark:shadow-cyan-900/30"
          style={{ fontSize: "0.875rem", fontWeight: 600 }}
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className={`w-full pl-9 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-300 transition ${
              dark
                ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-600"
                : "bg-gray-50 border-gray-100 text-gray-800"
            }`}
            style={{ fontSize: "0.875rem" }}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
            {(["all", "income", "expense"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg capitalize transition ${
                  filterType === t
                    ? "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400"
                    : dark
                    ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                }`}
                style={{ fontSize: "0.8rem", fontWeight: 600 }}
              >
                {t}
              </button>
            ))}
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as "all" | Category)}
            className={selectCls}
            style={{ fontSize: "0.8rem" }}
          >
            <option value="all">All Categories</option>
            {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "amount")}
            className={selectCls}
            style={{ fontSize: "0.8rem" }}
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>
      </div>

      {/* Net total */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-end gap-2">
          <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.8rem" }}>Net total:</span>
          <span
            className={totalFiltered >= 0 ? "text-emerald-500" : "text-rose-500"}
            style={{ fontWeight: 700, fontSize: "1rem" }}
          >
            {totalFiltered >= 0 ? "+" : "-"}{formatINR(Math.abs(totalFiltered))}
          </span>
        </div>
      )}

      {/* Transaction List */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-300 dark:text-gray-600">
            <ArrowUpRight className="w-12 h-12 mb-3 opacity-40" />
            <p style={{ fontSize: "0.95rem", fontWeight: 600 }}>No transactions found</p>
            <p style={{ fontSize: "0.8rem" }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
              >
                <CategoryIcon category={t.category} />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 dark:text-gray-200 truncate" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                    {t.description}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.72rem" }}>{t.category}</span>
                    <span className="text-gray-200 dark:text-gray-700">·</span>
                    <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.72rem" }}>
                      {format(parseISO(t.date), "d MMM yyyy")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={t.type === "income" ? "text-emerald-500" : "text-rose-500"}
                    style={{ fontWeight: 700, fontSize: "0.9rem" }}
                  >
                    {t.type === "income" ? "+" : "-"}{formatINR(t.amount)}
                  </span>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
