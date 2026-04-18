import { useState } from "react";
import { X } from "lucide-react";
import { useExpense, Category, TransactionType } from "../context/ExpenseContext";
import { useApp } from "../context/AppContext";

const expenseCategories: Category[] = [
  "Food & Dining", "Transport", "Shopping", "Entertainment",
  "Health", "Housing", "Education", "Travel", "Other",
];
const incomeCategories: Category[] = ["Salary", "Freelance", "Investment", "Other"];

interface Props {
  onClose: () => void;
  defaultType?: TransactionType;
}

export function AddTransactionModal({ onClose, defaultType = "expense" }: Props) {
  const { addTransaction } = useExpense();
  const { theme } = useApp();
  const dark = theme === "dark";

  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food & Dining");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState("");

  const categories = type === "expense" ? expenseCategories : incomeCategories;

  const handleTypeChange = (t: TransactionType) => {
    setType(t);
    setCategory(t === "expense" ? "Food & Dining" : "Salary");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (!description.trim()) {
      setError("Please enter a description.");
      return;
    }
    addTransaction({ type, amount: parseFloat(amount), category, description: description.trim(), date });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative rounded-2xl shadow-2xl w-full max-w-md p-6 z-10 ${dark ? "bg-gray-900 border border-gray-800" : "bg-white"}`}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-gray-900 dark:text-gray-100" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
            Add Transaction
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Type Toggle */}
        <div className="flex gap-2 mb-5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          {(["expense", "income"] as TransactionType[]).map((t) => (
            <button
              key={t}
              onClick={() => handleTypeChange(t)}
              className={`flex-1 py-2 rounded-lg capitalize transition-all ${
                type === t
                  ? t === "expense"
                    ? "bg-rose-500 text-white shadow-sm"
                    : "bg-emerald-500 text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
              style={{ fontSize: "0.875rem", fontWeight: 600 }}
            >
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" style={{ fontWeight: 600 }}>₹</span>
              <input
                type="number"
                step="1"
                min="0"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setError(""); }}
                placeholder="0"
                className={`w-full pl-8 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-400 transition ${
                  dark
                    ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-600"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-400 transition appearance-none ${
                dark
                  ? "bg-gray-800 border-gray-700 text-gray-100"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => { setDescription(e.target.value); setError(""); }}
              placeholder="What was this for?"
              className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-400 transition ${
                dark
                  ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-600"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-400 transition ${
                dark
                  ? "bg-gray-800 border-gray-700 text-gray-100"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
            />
          </div>

          {error && <p className="text-rose-500" style={{ fontSize: "0.8rem" }}>{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2.5 border rounded-xl transition ${
                dark
                  ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
              style={{ fontWeight: 600, fontSize: "0.875rem" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-2.5 rounded-xl text-white transition shadow-md ${
                type === "expense"
                  ? "bg-rose-500 hover:bg-rose-600"
                  : "bg-emerald-500 hover:bg-emerald-600"
              }`}
              style={{ fontWeight: 600, fontSize: "0.875rem" }}
            >
              Add {type}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
