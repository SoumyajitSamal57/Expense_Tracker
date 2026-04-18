import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ExpenseProvider } from "./context/ExpenseContext";
import { AppProvider } from "./context/AppContext";

export default function App() {
  return (
    <AppProvider>
      <ExpenseProvider>
        <RouterProvider router={router} />
      </ExpenseProvider>
    </AppProvider>
  );
}
