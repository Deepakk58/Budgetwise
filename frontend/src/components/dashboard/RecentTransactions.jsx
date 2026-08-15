import {
    ArrowDownLeft,
    ArrowUpRight,
    Receipt,
} from "lucide-react";

import Section from "../ui/Section";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import {
    formatCurrency,
    formatDate,
    parseAmount,
} from "../../lib/format";
import { cn } from "../../lib/cn";

function buildRecentTransactions(expenses, incomes) {
    const expenseItems = (expenses || []).map((expense) => ({
        id: expense._id,
        type: "expense",
        name: expense.name,
        category: expense.category?.title || "Uncategorized",
        amount: parseAmount(expense.amount),
        date: expense.date,
    }));

    const incomeItems = (incomes || []).map((income) => ({
        id: income._id,
        type: "income",
        name: income.name,
        category: "Income",
        amount: parseAmount(income.amount),
        date: income.date,
    }));

    return [...expenseItems, ...incomeItems].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );
}

function RecentTransactions({ expenses, incomes }) {
    const transactions = buildRecentTransactions(expenses, incomes);

    return (
        <Section
            title="Recent Transactions"
            subtitle="Your latest income and expense activity."
        >
            {transactions.length === 0 ? (
                <EmptyState
                    icon={Receipt}
                    title="No transactions yet"
                    description="Add income or expenses to see your recent activity here."
                />
            ) : (
                <Card className="overflow-hidden p-0">
                    <ul
                        className="
                            divide-y
                            divide-zinc-200

                            dark:divide-zinc-800
                        "
                    >
                        {transactions.map((transaction) => {
                            const isExpense = transaction.type === "expense";

                            return (
                                <li
                                    key={`${transaction.type}-${transaction.id}`}
                                    className="
                                        flex
                                        items-center
                                        gap-4

                                        p-4
                                        sm:p-5
                                    "
                                >
                                    <div
                                        className={cn(
                                            `
                                                flex
                                                h-10
                                                w-10
                                                shrink-0
                                                items-center
                                                justify-center

                                                rounded-xl
                                            `,
                                            isExpense
                                                ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
                                                : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                                        )}
                                    >
                                        {isExpense ? (
                                            <ArrowUpRight size={18} />
                                        ) : (
                                            <ArrowDownLeft size={18} />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div
                                            className="
                                                flex
                                                flex-col
                                                gap-1

                                                sm:flex-row
                                                sm:items-center
                                                sm:justify-between
                                            "
                                        >
                                            <div className="min-w-0">
                                                <p
                                                    className="
                                                        truncate
                                                        font-medium
                                                    "
                                                >
                                                    {transaction.name}
                                                </p>
                                                <p
                                                    className="
                                                        mt-0.5
                                                        text-sm

                                                        text-zinc-500
                                                        dark:text-zinc-400
                                                    "
                                                >
                                                    {transaction.category}
                                                    {" · "}
                                                    {formatDate(transaction.date)}
                                                </p>
                                            </div>

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2

                                                    sm:flex-col
                                                    sm:items-end
                                                    sm:gap-1
                                                "
                                            >
                                                <span
                                                    className={cn(
                                                        `
                                                            text-xs
                                                            font-medium
                                                            uppercase
                                                            tracking-wide
                                                        `,
                                                        isExpense
                                                            ? "text-red-600 dark:text-red-400"
                                                            : "text-emerald-600 dark:text-emerald-400"
                                                    )}
                                                >
                                                    {isExpense
                                                        ? "Expense"
                                                        : "Income"}
                                                </span>

                                                <span
                                                    className={cn(
                                                        `
                                                            font-semibold
                                                            tabular-nums
                                                        `,
                                                        isExpense
                                                            ? "text-red-600 dark:text-red-400"
                                                            : "text-emerald-600 dark:text-emerald-400"
                                                    )}
                                                >
                                                    {isExpense ? "-" : "+"}
                                                    {formatCurrency(
                                                        transaction.amount
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </Card>
            )}
        </Section>
    );
}

export default RecentTransactions;
