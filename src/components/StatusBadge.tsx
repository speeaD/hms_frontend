type StatusStyle = { bg: string; text: string; dot: string; label: string };

const RESERVATION_STYLES: Record<string, StatusStyle> = {
  pending: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500", label: "Pending" },
  confirmed: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", label: "Confirmed" },
  "checked-in": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", label: "Checked in" },
  "checked-out": { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-400", label: "Checked out" },
  cancelled: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", label: "Cancelled" },
};

const PAYMENT_STYLES: Record<string, StatusStyle> = {
  pending: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500", label: "Pending" },
  paid: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", label: "Paid" },
  refunded: { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-400", label: "Refunded" },
};

export function StatusBadge({
  status,
  kind,
}: {
  status: string;
  kind: "reservation" | "payment";
}) {
  const map = kind === "payment" ? PAYMENT_STYLES : RESERVATION_STYLES;
  const style: StatusStyle = map[status] ?? {
    bg: "bg-gray-50",
    text: "text-gray-700",
    dot: "bg-gray-500",
    label: status,
  };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.text}`}>
      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}
