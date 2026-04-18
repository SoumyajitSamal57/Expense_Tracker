import { useState } from "react";
import { useNavigate } from "react-router";
import {
  TrendingUp, TrendingDown, Wallet, Plus, ArrowUpRight, ChevronRight, Trash2
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { useExpense } from "../context/ExpenseContext";
import { useApp } from "../context/AppContext";
import { AddTransactionModal } from "./AddTransactionModal";
import { CategoryIcon, CATEGORY_COLORS } from "./CategoryIcon";
import { formatINR } from "../utils/formatINR";
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO, subMonths } from "date-fns";

const tooltipStyle = (dark: boolean) => ({
  borderRadius: "12px",
  border: "none",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  fontSize: "12px",
  backgroundColor: dark ? "#1f2937" : "#ffffff",
  color: dark ? "#f3f4f6" : "#111827",
});

export function Dashboard() {
  const { transactions, deleteTransaction } = useExpense();
  const { theme, userName } = useApp();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const dark = theme === "dark";

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTransaction(id);
  };

  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);

  const thisMonthTx = transactions.filter((t) =>
    isWithinInterval(parseISO(t.date), { start: thisMonthStart, end: thisMonthEnd })
  );

  const totalIncome = thisMonthTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = thisMonthTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(now, 5 - i);
    const mStart = startOfMonth(date);
    const mEnd = endOfMonth(date);
    const mTx = transactions.filter((t) =>
      isWithinInterval(parseISO(t.date), { start: mStart, end: mEnd })
    );
    return {
      month: format(date, "MMM"),
      income: mTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
      expenses: mTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    };
  });

  const categoryTotals = thisMonthTx
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  const recentTx = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(0) : "0";
  const firstName = userName.split(" ")[0];

  const axisColor = dark ? "#6b7280" : "#94a3b8";
  const gridColor = dark ? "#1f2937" : "#f1f5f9";

  return (
    <div className="p-6 space-y-6 bg-[#f5f6fa] dark:bg-gray-950 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-gray-100" style={{ fontWeight: 700, fontSize: "1.4rem" }}>
            Hello, {firstName}! 👋
          </h1>
          <p className="text-gray-400 dark:text-gray-500 mt-0.5" style={{ fontSize: "0.85rem" }}>
            {format(now, "EEEE, d MMMM yyyy")}
          </p>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Balance */}
        <div className="bg-cyan-600 rounded-2xl p-5 text-white shadow-lg shadow-cyan-200 dark:shadow-cyan-900/30">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="text-cyan-200" style={{ fontSize: "0.75rem", fontWeight: 600 }}>THIS MONTH</span>
          </div>
          <p className="text-white/70" style={{ fontSize: "0.8rem" }}>Net Balance</p>
          <p className="text-white mt-1" style={{ fontWeight: 700, fontSize: "1.8rem" }}>
            {balance >= 0 ? "+" : ""}{formatINR(Math.abs(balance))}
          </p>
          <div className="mt-3 flex items-center gap-1.5">
            <div className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full"
                style={{ width: totalIncome > 0 ? `${Math.min((balance / totalIncome) * 100, 100)}%` : "0%" }}
              />
            </div>
            <span className="text-white/80 shrink-0" style={{ fontSize: "0.75rem" }}>{savingsRate}% savings</span>
          </div>
        </div>

        {/* Income */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full" style={{ fontSize: "0.7rem", fontWeight: 600 }}>INCOME</span>
          </div>
          <p className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.8rem" }}>Total Income</p>
          <p className="text-gray-900 dark:text-gray-100 mt-1" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
            {formatINR(totalIncome)}
          </p>
          <p className="text-gray-400 dark:text-gray-500 mt-2" style={{ fontSize: "0.75rem" }}>
            {thisMonthTx.filter((t) => t.type === "income").length} transactions
          </p>
        </div>

        {/* Expenses */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-rose-500" />
            </div>
            <span className="text-rose-500 bg-rose-50 dark:bg-rose-900/30 px-2 py-0.5 rounded-full" style={{ fontSize: "0.7rem", fontWeight: 600 }}>EXPENSES</span>
          </div>
          <p className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.8rem" }}>Total Expenses</p>
          <p className="text-gray-900 dark:text-gray-100 mt-1" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
            {formatINR(totalExpenses)}
          </p>
          <p className="text-gray-400 dark:text-gray-500 mt-2" style={{ fontSize: "0.75rem" }}>
            {thisMonthTx.filter((t) => t.type === "expense").length} transactions
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 dark:text-gray-200" style={{ fontWeight: 700, fontSize: "0.95rem" }}>Income vs Expenses</h3>
            <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.75rem" }}>Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle(dark)} formatter={(value: number) => [formatINR(value), ""]} />
              <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2.5} fill="url(#incomeGrad)" name="Income" />
              <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2.5} fill="url(#expenseGrad)" name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.75rem" }}>Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.75rem" }}>Expenses</span>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-gray-800 dark:text-gray-200 mb-1" style={{ fontWeight: 700, fontSize: "0.95rem" }}>Spending by Category</h3>
          <p className="text-gray-400 dark:text-gray-500 mb-3" style={{ fontSize: "0.75rem" }}>This month</p>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#6b7280"} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle(dark)} formatter={(value: number) => [formatINR(value), ""]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-1">
                {pieData.slice(0, 4).map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[entry.name] }} />
                      <span className="text-gray-600 dark:text-gray-400 truncate max-w-[100px]" style={{ fontSize: "0.75rem" }}>{entry.name}</span>
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 shrink-0" style={{ fontSize: "0.75rem", fontWeight: 600 }}>{formatINR(entry.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-300 dark:text-gray-600" style={{ fontSize: "0.85rem" }}>
              No expenses this month
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-800 dark:text-gray-200" style={{ fontWeight: 700, fontSize: "0.95rem" }}>Recent Transactions</h3>
          <button
            onClick={() => navigate("/transactions")}
            className="flex items-center gap-1 text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 transition"
            style={{ fontSize: "0.8rem", fontWeight: 600 }}
          >
            View all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-3">
          {recentTx.map((t) => (
            <div key={t.id} className="flex items-center gap-3 p-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <CategoryIcon category={t.category} />
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 dark:text-gray-200 truncate" style={{ fontSize: "0.875rem", fontWeight: 600 }}>{t.description}</p>
                <p className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.75rem" }}>{t.category} · {format(parseISO(t.date), "d MMM yyyy")}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1">
                  <span
                    className={t.type === "income" ? "text-emerald-500" : "text-rose-500"}
                    style={{ fontWeight: 700, fontSize: "0.9rem" }}
                  >
                    {t.type === "income" ? "+" : "-"}{formatINR(t.amount)}
                  </span>
                  <ArrowUpRight className={`w-3.5 h-3.5 ${t.type === "income" ? "text-emerald-400" : "text-rose-400 rotate-180"}`} />
                </div>
                <button
                  onClick={(e) => handleDelete(t.id, e)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-400`}
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
