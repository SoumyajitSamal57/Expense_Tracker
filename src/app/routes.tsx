import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Transactions } from "./components/Transactions";
import { Analytics } from "./components/Analytics";
import { Budget } from "./components/Budget";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "transactions", Component: Transactions },
      { path: "analytics", Component: Analytics },
      { path: "budget", Component: Budget },
    ],
  },
]);
