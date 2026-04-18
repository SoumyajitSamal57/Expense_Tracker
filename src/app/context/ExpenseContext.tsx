import React, { createContext, useContext, useState, ReactNode } from "react";

export type TransactionType = "income" | "expense";

export type Category =
  | "Food & Dining"
  | "Transport"
  | "Shopping"
  | "Entertainment"
  | "Health"
  | "Housing"
  | "Education"
  | "Travel"
  | "Salary"
  | "Freelance"
  | "Investment"
  | "Other";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: string;
}

export interface Budget {
  category: Category;
  limit: number;
}

interface ExpenseContextType {
  transactions: Transaction[];
  budgets: Budget[];
  addTransaction: (t: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  updateBudget: (category: Category, limit: number) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialTransactions: Transaction[] = [];

const initialBudgets: Budget[] = [
  { category: "Food & Dining", limit: 8000 },
  { category: "Transport", limit: 2500 },
  { category: "Shopping", limit: 10000 },
  { category: "Entertainment", limit: 2000 },
  { category: "Health", limit: 5000 },
  { category: "Housing", limit: 22000 },
  { category: "Education", limit: 3000 },
  { category: "Travel", limit: 10000 },
];

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);

  const addTransaction = (t: Omit<Transaction, "id">) => {
    setTransactions((prev) => [{ ...t, id: generateId() }, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateBudget = (category: Category, limit: number) => {
    setBudgets((prev) => {
      const exists = prev.find((b) => b.category === category);
      if (exists) {
        return prev.map((b) => (b.category === category ? { ...b, limit } : b));
      }
      return [...prev, { category, limit }];
    });
  };

  return (
    <ExpenseContext.Provider value={{ transactions, budgets, addTransaction, deleteTransaction, updateBudget }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error("useExpense must be used within ExpenseProvider");
  return ctx;
}
