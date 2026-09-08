const CURRENCY = "NGN";

export function formatCurrency(amount: string | number | undefined, currency = CURRENCY) {
  if (amount === undefined) return "—";
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  if (Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function nightsBetween(checkIn: string | Date, checkOut: string | Date) {
  const inDate = typeof checkIn === "string" ? new Date(checkIn) : checkIn;
  const outDate = typeof checkOut === "string" ? new Date(checkOut) : checkOut;
  const ms = outDate.getTime() - inDate.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export function formatRoomType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
