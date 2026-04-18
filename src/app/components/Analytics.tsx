import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import { useExpense } from "../context/ExpenseContext";
import { useApp } from "../context/AppContext";
import { CATEGORY_COLORS } from "./CategoryIcon";
import { formatINR } from "../utils/formatINR";
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO, subMonths } from "date-fns";
import { TrendingDown, TrendingUp, Award } from "lucide-react";

export function Analytics() {
  const { transactions } = useExpense();
  const { theme } = useApp();
  const dark = theme === "dark";
  const [selectedMonth, setSelectedMonth] = useState(0);

  const now = new Date();
  const targetDate = subMonths(now, selectedMonth);
  const monthStart = startOfMonth(targetDate);
  const monthEnd = endOfMonth(targetDate);

  const monthTx = transactions.filter((t) =>
    isWithinInterval(parseISO(t.date), { start: monthStart, end: monthEnd })
  );

  const totalIncome = monthTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const categoryTotals = monthTx
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({
      name,
      value,
      pct: totalExpenses > 0 ? ((value / totalExpenses) * 100).toFixed(1) : "0",
    }));

  const monthlyBar = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(now, 5 - i);
    const mTx = transactions.filter((t) =>
      isWithinInterval(parseISO(t.date), { start: startOfMonth(date), end: endOfMonth(date) })
    );
    return {
      month: format(date, "MMM"),
      income: mTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
      expenses: mTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    };
  });

  const dailySpending = monthTx
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const day = parseInt(format(parseISO(t.date), "d"));
      acc[day] = (acc[day] || 0) + t.amount;
      return acc;
    }, {} as Record<number, number>);

  const totalDays = parseInt(format(monthEnd, "d"));
  const dailyData = Array.from({ length: totalDays }, (_, i) => ({
    day: i + 1,
    amount: dailySpending[i + 1] || 0,
  }));

  const topCategory = categoryData[0];
  const avgDailySpend = totalExpenses / totalDays;

  const months = Array.from({ length: 6 }, (_, i) => ({
    label: format(subMonths(now, i), "MMMM yyyy"),
    value: i,
  }));

  const axisColor = dark ? "#6b7280" : "#94a3b8";
  const gridColor = dark ? "#1f2937" : "#f1f5f9";
  const tooltipStyle = {
    borderRadius: "12px",
    border: "none",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    fontSize: "12px",
    backgroundColor: dark ? "#1f2937" : "#ffffff",
    color: dark ? "#f3f4f6" : "#111827",
  };

  const cardCls = "bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800";

  return (
    <div className="p-6 space-y-5 bg-[#f5f6fa] dark:bg-gray-950 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-gray-100" style={{ fontWeight: 700, fontSize: "1.4rem" }}>Analytics</h1>
          <p className="text-gray-400 dark:text-gray-500 mt-0.5" style={{ fontSize: "0.85rem" }}>Spending insights & trends</p>
        </div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className={`px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200 shadow-sm ${
            dark ? "bg-gray-900 border-gray-700 text-gray-300" : "bg-white border-gray-200 text-gray-600"
          }`}
          style={{ fontSize: "0.85rem" }}
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={cardCls + " p-4"}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-rose-500" />
            </div>
            <div>
              <p className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.75rem" }}>Avg Daily Spend</p>
              <p className="text-gray-900 dark:text-gray-100" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                {formatINR(avgDailySpend)}
              </p>
            </div>
          </div>
        </div>
        <div className={cardCls + " p-4"}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-50 dark:bg-violet-900/20 rounded-xl flex items-center justify-center">
              <Award className="w-4 h-4 text-violet-500" />
            </div>
            <div>
              <p className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.75rem" }}>Top Category</p>
              <p className="text-gray-900 dark:text-gray-100" style={{ fontWeight: 700, fontSize: "1rem" }}>
                {topCategory?.name || "—"}
              </p>
            </div>
          </div>
        </div>
        <div className={cardCls + " p-4"}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.75rem" }}>Savings Rate</p>
              <p className="text-gray-900 dark:text-gray-100" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                {totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : "0"}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar chart */}
        <div className={cardCls + " p-5"}>
          <h3 className="text-gray-800 dark:text-gray-200 mb-4" style={{ fontWeight: 700, fontSize: "0.95rem" }}>Monthly Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyBar} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatINR(value), ""]} />
              <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} name="Income" maxBarSize={30} />
              <Bar dataKey="expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Expenses" maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-1">
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

        {/* Pie */}
        <div className={cardCls + " p-5"}>
          <h3 className="text-gray-800 dark:text-gray-200 mb-2" style={{ fontWeight: 700, fontSize: "0.95rem" }}>Expense Breakdown</h3>
          {categoryData.length > 0 ? (
            <div className="flex gap-4">
              <ResponsiveContainer width="45%" height={200}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#6b7280"} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatINR(value), ""]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2 py-2">
                {categoryData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[entry.name] }} />
                    <span className="text-gray-500 dark:text-gray-400 flex-1 truncate" style={{ fontSize: "0.72rem" }}>{entry.name}</span>
                    <span className="text-gray-400 dark:text-gray-500 shrink-0" style={{ fontSize: "0.72rem" }}>{entry.pct}%</span>
                    <span className="text-gray-800 dark:text-gray-200 shrink-0" style={{ fontSize: "0.72rem", fontWeight: 600 }}>{formatINR(entry.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-300 dark:text-gray-600" style={{ fontSize: "0.9rem" }}>
              No expense data
            </div>
          )}
        </div>
      </div>

      {/* Daily spending */}
      <div className={cardCls + " p-5"}>
        <h3 className="text-gray-800 dark:text-gray-200 mb-4" style={{ fontWeight: 700, fontSize: "0.95rem" }}>
          Daily Spending — {format(targetDate, "MMMM yyyy")}
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={dailyData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="dailyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="day" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
            <YAxis tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value: number) => [formatINR(value), "Spent"]}
              labelFormatter={(l) => `Day ${l}`}
            />
            <Area type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#dailyGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
