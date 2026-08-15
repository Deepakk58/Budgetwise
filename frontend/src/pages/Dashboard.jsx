import {
    TrendingDown,
    TrendingUp,
    Wallet,
} from "lucide-react";

import useDashboard from "../hooks/useDashboard";

import PageHeader from "../components/ui/PageHeader";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import FadeIn from "../components/ui/FadeIn";
import Card from "../components/ui/Card";
import SummaryCard from "../components/dashboard/SummaryCard";
import BudgetOverview from "../components/dashboard/BudgetOverview";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import DashboardCharts from "../components/dashboard/DashboardCharts";

function Dashboard() {
    const {
        dashboardQuery,
        budgetQuery,
        chartsQuery,
        isLoading,
        isError,
        error,
        refetch,
    } = useDashboard();

    if (isLoading) {
        return <Spinner fullScreen />;
    }

    if (isError) {
        return (
            <div className="py-10">
                <Card className="mx-auto max-w-lg p-8 text-center">
                    <h2 className="text-xl font-semibold">
                        Unable to load dashboard
                    </h2>
                    <p
                        className="
                            mt-3
                            text-sm
                            leading-6

                            text-zinc-500
                            dark:text-zinc-400
                        "
                    >
                        {error?.response?.data?.message ||
                            error?.message ||
                            "Something went wrong while fetching your data."}
                    </p>

                    <div className="mt-6">
                        <Button
                            variant="blue"
                            onClick={() => refetch()}
                        >
                            Try Again
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    const {
        total_income: totalIncome,
        total_expense: totalExpense,
        saving,
        expenses,
        incomes,
    } = dashboardQuery.data;

    const { budgets, monthExpenses } = budgetQuery.data;

    return (
        <FadeIn>
            <PageHeader
                title="Dashboard"
            />

            <div
                className="
                    grid
                    gap-4

                    sm:grid-cols-2
                    xl:grid-cols-3
                "
            >
                <SummaryCard
                    label="Total Income"
                    value={totalIncome}
                    icon={TrendingUp}
                    tone="income"
                />

                <SummaryCard
                    label="Total Expenses"
                    value={totalExpense}
                    icon={TrendingDown}
                    tone="expense"
                />

                <SummaryCard
                    label="Balance / Savings"
                    value={saving}
                    icon={Wallet}
                    tone="savings"
                />
            </div>

            <div className="mt-10 space-y-10">
                <RecentTransactions
                    expenses={expenses}
                    incomes={incomes}
                />

                <BudgetOverview
                    budgets={budgets}
                    monthExpenses={monthExpenses}
                />

                <DashboardCharts chartsQuery={chartsQuery} />
            </div>
        </FadeIn>
    );
}

export default Dashboard;
