export function formatINR(amount: number, decimals = false): string {
  return (
    "₹" +
    amount.toLocaleString("en-IN", {
      minimumFractionDigits: decimals ? 2 : 0,
      maximumFractionDigits: decimals ? 2 : 0,
    })
  );
}
