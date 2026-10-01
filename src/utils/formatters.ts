export function formatCurrency(
  value: number | null | undefined,
  currency = "INR",
  decimals = 2
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "Unavailable";
  }

  const prefix = currency === "INR" ? "₹" : "$";
  const parts = value.toFixed(decimals).split(".");
  let integerPart = parts[0];
  const decimalPart = parts[1];

  const isNegative = integerPart.startsWith("-");
  if (isNegative) {
    integerPart = integerPart.substring(1);
  }

  let lastThree = integerPart.slice(-3);
  const otherNumbers = integerPart.slice(0, -3);
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  const formattedInteger =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

  const result = `${prefix}${formattedInteger}${decimals > 0 ? "." + decimalPart : ""}`;
  return isNegative ? `-${result}` : result;
}

export function formatPercentage(
  value: number | null | undefined,
  includeSign = true,
  decimals = 2
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "Unavailable";
  }

  const formatted = Math.abs(value).toFixed(decimals);
  if (!includeSign) {
    return `${formatted}%`;
  }

  if (value > 0) {
    return `+${formatted}%`;
  }
  if (value < 0) {
    return `-${formatted}%`;
  }
  return `0.00%`;
}

export function formatNumber(
  value: number | null | undefined,
  decimals = 2
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "Unavailable";
  }

  return value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

export function formatTime(isoString: string | null | undefined): string {
  if (!isoString) return "Never";
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  } catch {
    return "Invalid time";
  }
}
