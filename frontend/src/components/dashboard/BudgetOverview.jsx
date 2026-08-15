import { useState } from "react";
import { PiggyBank, Settings2 } from "lucide-react";

import Section from "../ui/Section";
import Card from "../ui/Card";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import SetBudgetModal from "./SetBudgetModal";
import useBudget from "../../hooks/useBudget";
import { parseAmount, formatCurrency } from "../../lib/format";
import { cn } from "../../lib/cn";

function getBudgetStatus({ percentage, isOverBudget }) {
    if (isOverBudget) {
        return {
            label: "Over budget",
            tone: "danger",
        };
    }

    if (percentage >= 80) {
        return {
            label: `${Math.round(percentage)}% used`,
            tone: "warning",
        };
    }

    return {
        label: `${Math.round(percentage)}% used`,
        tone: "success",
    };
}

function BudgetOverview({ budgets, monthExpenses }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        categoriesQuery,
        setMultipleMutation,
        isLoadingCategories,
        isCategoriesError,
    } = useBudget();

    const items = (budgets || []).map((budget) => {
        const categoryTitle = budget.category?.title || "Uncategorized";
        const limit = parseAmount(budget.amount);
        const spent = parseAmount(monthExpenses?.[categoryTitle]);
        const remaining = limit - spent;
        const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
        const isOverBudget = spent > limit;
        const status = getBudgetStatus({
            percentage,
            isOverBudget,
        });

        return {
            id: budget._id,
            categoryTitle,
            limit,
            spent,
            remaining,
            percentage,
            isOverBudget,
            status,
        };
    });

    const totalBudget = items.reduce((sum, item) => sum + item.limit, 0);
    const totalSpent = items.reduce((sum, item) => sum + item.spent, 0);
    const totalRemaining = totalBudget - totalSpent;

    const setBudgetAction = (
        <Button
            variant="blue"
            onClick={() => setIsModalOpen(true)}
        >
            <Settings2 size={16} />
            Set Budget
        </Button>
    );

    const handleSaveBudgets = async (payload) => {
        await setMultipleMutation.mutateAsync(payload);
    };

    return (
        <>
            <Section
                title="Budget Overview"
                subtitle={
                    items.length > 0
                        ? "Current month spending against your category budgets."
                        : "Track spending against your monthly category limits."
                }
                action={setBudgetAction}
            >
                {items.length === 0 ? (
                    <EmptyState
                        icon={PiggyBank}
                        title="No budgets set"
                        description="Set category budgets to see how your current month spending compares to your limits."
                        action={setBudgetAction}
                    />
                ) : (
                    <div className="space-y-6">
                        <div
                            className="
                                grid
                                gap-4

                                sm:grid-cols-2
                                xl:grid-cols-3
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

                            <Card className="p-5">
                                <p
                                    className="
                                        text-sm
                                        font-medium

                                        text-zinc-500
                                        dark:text-zinc-400
                                    "
                                >
                                    Remaining
                                </p>
                                <p
                                    className={cn(
                                        `
                                            mt-2
                                            text-2xl
                                            font-bold
                                            tracking-tight
                                        `,
                                        totalRemaining < 0
                                            ? "text-red-600 dark:text-red-400"
                                            : "text-emerald-600 dark:text-emerald-400"
                                    )}
                                >
                                    {formatCurrency(totalRemaining)}
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
                                                {formatCurrency(item.spent)} spent of{" "}
                                                {formatCurrency(item.limit)}
                                            </p>
                                            <p
                                                className={cn(
                                                    `
                                                        mt-1
                                                        text-sm
                                                        font-medium
                                                    `,
                                                    item.remaining < 0
                                                        ? "text-red-600 dark:text-red-400"
                                                        : "text-emerald-600 dark:text-emerald-400"
                                                )}
                                            >
                                                {item.remaining < 0
                                                    ? `${formatCurrency(Math.abs(item.remaining))} over limit`
                                                    : `${formatCurrency(item.remaining)} remaining`}
                                            </p>
                                        </div>

                                        <span
                                            className={cn(
                                                `
                                                    text-sm
                                                    font-semibold
                                                `,
                                                item.status.tone === "danger"
                                                    ? "text-red-600 dark:text-red-400"
                                                    : item.status.tone === "warning"
                                                        ? "text-amber-600 dark:text-amber-400"
                                                        : "text-zinc-600 dark:text-zinc-300"
                                            )}
                                        >
                                            {item.status.label}
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
                                                    : item.status.tone === "warning"
                                                        ? "bg-amber-500"
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
                )}
            </Section>

            <SetBudgetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                categories={categoriesQuery.data || []}
                budgets={budgets || []}
                onSubmit={handleSaveBudgets}
                loading={setMultipleMutation.isPending}
                categoriesLoading={isLoadingCategories}
                categoriesError={isCategoriesError}
            />
        </>
    );
}

export default BudgetOverview;
