export function parseAmount(value) {
    if (value == null) return 0;
    if (typeof value === "number") return value;
    if (typeof value === "string") return parseFloat(value) || 0;
    if (typeof value === "object" && value.$numberDecimal != null) {
        return parseFloat(value.$numberDecimal) || 0;
    }
    if (typeof value === "object" && typeof value.toString === "function") {
        return parseFloat(value.toString()) || 0;
    }
    return 0;
}

export function formatCurrency(value) {
    const num = parseAmount(value);

    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
}

export function formatDate(value) {
    if (!value) return "—";

    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(value));
}
