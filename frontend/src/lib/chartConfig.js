export const CHART_COLORS = [
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#ca8a04",
    "#9333ea",
    "#0891b2",
    "#ea580c",
    "#db2777",
    "#4f46e5",
    "#059669",
];

export function getChartTheme(isDark) {
    return {
        text: isDark ? "#aab4c3" : "#71717a",
        grid: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
        tooltipBg: isDark ? "#151b24" : "#ffffff",
        tooltipBorder: isDark ? "#2a3441" : "#e4e4e7",
        tooltipText: isDark ? "#f8fafc" : "#09090b",
    };
}

export function formatMonthLabel(monthKey) {
    if (!monthKey) return "";

    const [year, month] = monthKey.split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);

    return new Intl.DateTimeFormat(undefined, {
        month: "short",
        year: "numeric",
    }).format(date);
}

export function getBaseChartOptions(isDark) {
    const theme = getChartTheme(isDark);

    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: theme.text,
                    boxWidth: 12,
                    boxHeight: 12,
                    usePointStyle: true,
                },
            },
            tooltip: {
                backgroundColor: theme.tooltipBg,
                borderColor: theme.tooltipBorder,
                borderWidth: 1,
                titleColor: theme.tooltipText,
                bodyColor: theme.tooltipText,
            },
        },
        scales: {
            x: {
                ticks: { color: theme.text },
                grid: { color: theme.grid },
            },
            y: {
                ticks: { color: theme.text },
                grid: { color: theme.grid },
                beginAtZero: true,
            },
        },
    };
}
