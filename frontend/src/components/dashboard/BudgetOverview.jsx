import { PiggyBank } from "lucide-react";

import Section from "../ui/Section";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { parseAmount, formatCurrency } from "../../lib/format";
import { cn } from "../../lib/cn";

function BudgetOverview({ budgets, monthExpenses }) {
    const items = (budgets || []).map((budget) => {
        const categoryTitle = budget.category?.title || "Uncategorized";
        const limit = parseAmount(budget.amount);
        const spent = parseAmount(monthExpenses?.[categoryTitle]);
        const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
        const isOverBudget = spent > limit;

        return {
            id: budget._id,
            categoryTitle,
            limit,
            spent,
            percentage,
            isOverBudget,
        };
    });

    const totalBudget = items.reduce((sum, item) => sum + item.limit, 0);
    const totalSpent = items.reduce((sum, item) => sum + item.spent, 0);

    if (items.length === 0) {
        return (
            <Section
                title="Budget Overview"
                subtitle="Track spending against your monthly category limits."
            >
                <EmptyState
                    icon={PiggyBank}
                    title="No budgets set"
                    description="Set category budgets to see how your current month spending compares to your limits."
                />
            </Section>
        );
    }

    return (
        <Section
            title="Budget Overview"
            subtitle="Current month spending against your category budgets."
        >
            <div className="space-y-6">
                <div
                    className="
                        grid
                        gap-4

                        sm:grid-cols-2
                    "
                >
                    <Card className="p-5">
                        <p
                            className="
                                text-sm
                                font-medium

                                text-zinc-500
                                dark:text-zinc-400
                            "
                        >
                            Total Budget
                        </p>
                        <p
                            className="
                                mt-2
                                text-2xl
                                font-bold
                                tracking-tight
                            "
                        >
                            {formatCurrency(totalBudget)}
                        </p>
                    </Card>

                    <Card className="p-5">
                        <p
                            className="
                                text-sm
                                font-medium

                                text-zinc-500
                                dark:text-zinc-400
                            "
                        >
                            Spent This Month
                        </p>
                        <p
                            className={cn(
                                `
                                    mt-2
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                `,
                                totalSpent > totalBudget
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-zinc-900 dark:text-zinc-100"
                            )}
                        >
                            {formatCurrency(totalSpent)}
                        </p>
                    </Card>
                </div>

                <Card className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="space-y-3 p-5"
                        >
                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-2

                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >
                                <div>
                                    <p className="font-medium">
                                        {item.categoryTitle}
                                    </p>
                                    <p
                                        className="
                                            mt-1
                                            text-sm

                                            text-zinc-500
                                            dark:text-zinc-400
                                        "
                                    >
                                        {formatCurrency(item.spent)} of{" "}
                                        {formatCurrency(item.limit)}
                                    </p>
                                </div>

                                <span
                                    className={cn(
                                        `
                                            text-sm
                                            font-semibold
                                        `,
                                        item.isOverBudget
                                            ? "text-red-600 dark:text-red-400"
                                            : "text-zinc-600 dark:text-zinc-300"
                                    )}
                                >
                                    {item.isOverBudget
                                        ? "Over budget"
                                        : `${Math.round(item.percentage)}% used`}
                                </span>
                            </div>

                            <div
                                className="
                                    h-2
                                    overflow-hidden

                                    rounded-full

                                    bg-zinc-100
                                    dark:bg-zinc-800
                                "
                            >
                                <div
                                    className={cn(
                                        `
                                            h-full
                                            rounded-full

                                            transition-all
                                            duration-300
                                        `,
                                        item.isOverBudget
                                            ? "bg-red-500"
                                            : "bg-blue-600 dark:bg-blue-500"
                                    )}
                                    style={{
                                        width: `${item.percentage}%`,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </Card>
            </div>
        </Section>
    );
}

export default BudgetOverview;
