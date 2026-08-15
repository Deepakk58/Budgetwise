import { useMemo } from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";

import Section from "../ui/Section";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import Spinner from "../ui/Spinner";
import Button from "../ui/Button";
import { useTheme } from "../../context/ThemeContext";
import {
    CHART_COLORS,
    formatMonthLabel,
    getBaseChartOptions,
    getChartTheme,
} from "../../lib/chartConfig";
import { parseAmount, formatCurrency } from "../../lib/format";
import { cn } from "../../lib/cn";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement
);

function ChartCard({ title, subtitle, children, className }) {
    return (
        <Card className={cn("p-5", className)}>
            <div className="mb-5">
                <h3 className="font-semibold tracking-tight">
                    {title}
                </h3>
                {subtitle && (
                    <p
                        className="
                            mt-1
                            text-sm

                            text-zinc-500
                            dark:text-zinc-400
                        "
                    >
                        {subtitle}
                    </p>
                )}
            </div>
            {children}
        </Card>
    );
}

function ChartContainer({ children }) {
    return (
        <div className="relative h-64 sm:h-72">
            {children}
        </div>
    );
}

function DashboardCharts({ chartsQuery }) {
    const { darkMode } = useTheme();
    const theme = getChartTheme(darkMode);

    const chartData = chartsQuery.data;

    const expenseByCategory = useMemo(() => {
        if (!chartData?.cat_labels?.length) return null;

        const labels = chartData.cat_labels;
        const values = chartData.cat_totals.map(parseAmount);

        return {
            labels,
            datasets: [
                {
                    data: values,
                    backgroundColor: labels.map(
                        (_, index) => CHART_COLORS[index % CHART_COLORS.length]
                    ),
                    borderWidth: 0,
                },
            ],
        };
    }, [chartData]);

    const monthlyComparison = useMemo(() => {
        if (!chartData?.months?.length) return null;

        const labels = chartData.months.map(formatMonthLabel);

        return {
            labels,
            datasets: [
                {
                    label: "Income",
                    data: chartData.inc.map(parseAmount),
                    backgroundColor: "rgba(22, 163, 74, 0.85)",
                    borderRadius: 6,
                },
                {
                    label: "Expenses",
                    data: chartData.exp.map(parseAmount),
                    backgroundColor: "rgba(220, 38, 38, 0.85)",
                    borderRadius: 6,
                },
            ],
        };
    }, [chartData]);

    const incomeExpenseTrend = useMemo(() => {
        if (!chartData?.months?.length) return null;

        const labels = chartData.months.map(formatMonthLabel);

        return {
            labels,
            datasets: [
                {
                    label: "Income",
                    data: chartData.inc.map(parseAmount),
                    borderColor: "#16a34a",
                    backgroundColor: "rgba(22, 163, 74, 0.12)",
                    tension: 0.35,
                    fill: false,
                },
                {
                    label: "Expenses",
                    data: chartData.exp.map(parseAmount),
                    borderColor: "#dc2626",
                    backgroundColor: "rgba(220, 38, 38, 0.12)",
                    tension: 0.35,
                    fill: false,
                },
            ],
        };
    }, [chartData]);

    const doughnutOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
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
                    callbacks: {
                        label: (context) => {
                            const value = context.parsed;
                            const total = context.dataset.data.reduce(
                                (sum, item) => sum + item,
                                0
                            );
                            const percentage = total
                                ? Math.round((value / total) * 100)
                                : 0;

                            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                        },
                    },
                },
            },
        }),
        [theme]
    );

    const barOptions = useMemo(() => {
        const base = getBaseChartOptions(darkMode);

        return {
            ...base,
            plugins: {
                ...base.plugins,
                tooltip: {
                    ...base.plugins.tooltip,
                    callbacks: {
                        label: (context) =>
                            `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`,
                    },
                },
            },
        };
    }, [darkMode]);

    const lineOptions = useMemo(() => {
        const base = getBaseChartOptions(darkMode);

        return {
            ...base,
            plugins: {
                ...base.plugins,
                tooltip: {
                    ...base.plugins.tooltip,
                    callbacks: {
                        label: (context) =>
                            `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`,
                    },
                },
            },
        };
    }, [darkMode]);

    if (chartsQuery.isLoading) {
        return (
            <Section
                title="Analytics"
                subtitle="Visual breakdown of your income and spending."
            >
                <Card className="flex min-h-72 items-center justify-center">
                    <Spinner />
                </Card>
            </Section>
        );
    }

    if (chartsQuery.isError) {
        return (
            <Section
                title="Analytics"
                subtitle="Visual breakdown of your income and spending."
            >
                <Card className="p-8 text-center">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {chartsQuery.error?.response?.data?.message ||
                            chartsQuery.error?.message ||
                            "Unable to load chart data."}
                    </p>
                    <div className="mt-5">
                        <Button
                            variant="blue"
                            onClick={() => chartsQuery.refetch()}
                        >
                            Try Again
                        </Button>
                    </div>
                </Card>
            </Section>
        );
    }

    const hasAnyData =
        expenseByCategory ||
        monthlyComparison ||
        incomeExpenseTrend;

    if (!hasAnyData) {
        return (
            <Section
                title="Analytics"
                subtitle="Visual breakdown of your income and spending."
            >
                <EmptyState
                    icon={BarChart3}
                    title="No chart data yet"
                    description="Add income and expenses to see category breakdowns and trends here."
                />
            </Section>
        );
    }

    return (
        <Section
            title="Analytics"
            subtitle="Visual breakdown of your income and spending."
        >
            <div
                className="
                    grid
                    gap-6

                    xl:grid-cols-2
                "
            >
                <ChartCard
                    title="Expense by Category"
                    subtitle="Share of total spending by category."
                >
                    {expenseByCategory ? (
                        <ChartContainer>
                            <Doughnut
                                data={expenseByCategory}
                                options={doughnutOptions}
                            />
                        </ChartContainer>
                    ) : (
                        <EmptyState
                            icon={PieChart}
                            title="No expense data"
                            description="Add expenses to see category breakdown."
                        />
                    )}
                </ChartCard>

                <ChartCard
                    title="Monthly Income vs Expenses"
                    subtitle="Compare income and spending month by month."
                >
                    {monthlyComparison ? (
                        <ChartContainer>
                            <Bar
                                data={monthlyComparison}
                                options={barOptions}
                            />
                        </ChartContainer>
                    ) : (
                        <EmptyState
                            icon={BarChart3}
                            title="No monthly data"
                            description="Add transactions to compare monthly totals."
                        />
                    )}
                </ChartCard>

                <ChartCard
                    title="Income / Expense Trend"
                    subtitle="Track how income and spending change over time."
                    className="xl:col-span-2"
                >
                    {incomeExpenseTrend ? (
                        <ChartContainer>
                            <Line
                                data={incomeExpenseTrend}
                                options={lineOptions}
                            />
                        </ChartContainer>
                    ) : (
                        <EmptyState
                            icon={TrendingUp}
                            title="No trend data"
                            description="Add transactions to see income and expense trends."
                        />
                    )}
                </ChartCard>
            </div>
        </Section>
    );
}

export default DashboardCharts;
