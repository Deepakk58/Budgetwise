export function toInputDate(value) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    return date.toISOString().slice(0, 10);
}

export function getTodayInputDate() {
    return new Date().toISOString().slice(0, 10);
}
