import { Trash2, Receipt } from "lucide-react";

import Card from "../ui/Card";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import {
    formatCurrency,
    formatDate,
    parseAmount,
} from "../../lib/format";
import { getMemberName } from "../../lib/groupUtils";

function formatSplitSummary(expense) {
    const splits = expense.splits || [];

    if (splits.length === 0) {
        return "No split details";
    }

    return splits
        .map(
            (split) =>
                `${getMemberName(split.member)}: ${formatCurrency(parseAmount(split.amount))}`
        )
        .join(" · ");
}

function GroupExpenseList({
    expenses = [],
    canDelete = false,
    onDelete,
}) {
    if (expenses.length === 0) {
        return (
            <EmptyState
                icon={Receipt}
                title="No group expenses yet"
                description="Add an expense to start splitting costs with the group."
            />
        );
    }

    return (
        <Card className="overflow-hidden p-0">
            <div className="hidden md:block">
                <table className="w-full text-left text-sm">
                    <thead
                        className="
                            border-b
                            border-zinc-200

                            bg-zinc-50

                            dark:border-zinc-800
                            dark:bg-zinc-900/50
                        "
                    >
                        <tr>
                            <th className="px-5 py-3 font-medium">Title</th>
                            <th className="px-5 py-3 font-medium">Paid by</th>
                            <th className="px-5 py-3 font-medium">Date</th>
                            <th className="px-5 py-3 font-medium">Split</th>
                            <th className="px-5 py-3 font-medium text-right">
                                Amount
                            </th>
                            {canDelete && (
                                <th className="px-5 py-3 font-medium text-right">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody
                        className="
                            divide-y
                            divide-zinc-200

                            dark:divide-zinc-800
                        "
                    >
                        {expenses.map((expense) => (
                            <tr key={expense._id}>
                                <td className="px-5 py-4 font-medium">
                                    {expense.title}
                                </td>
                                <td className="px-5 py-4">
                                    {getMemberName(expense.paidBy)}
                                </td>
                                <td className="px-5 py-4">
                                    {formatDate(expense.date)}
                                </td>
                                <td
                                    className="
                                        max-w-xs
                                        truncate
                                        px-5
                                        py-4

                                        text-zinc-500
                                        dark:text-zinc-400
                                    "
                                    title={formatSplitSummary(expense)}
                                >
                                    {formatSplitSummary(expense)}
                                </td>
                                <td
                                    className="
                                        px-5
                                        py-4

                                        text-right
                                        font-semibold
                                        tabular-nums
                                    "
                                >
                                    {formatCurrency(parseAmount(expense.amount))}
                                </td>
                                {canDelete && (
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onDelete(expense)}
                                                aria-label={`Delete ${expense.title}`}
                                            >
                                                <Trash2
                                                    size={16}
                                                    className="
                                                        text-red-600
                                                        dark:text-red-400
                                                    "
                                                />
                                            </Button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ul
                className="
                    divide-y
                    divide-zinc-200

                    md:hidden

                    dark:divide-zinc-800
                "
            >
                {expenses.map((expense) => (
                    <li
                        key={expense._id}
                        className="space-y-3 p-4"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="truncate font-medium">
                                    {expense.title}
                                </p>
                                <p
                                    className="
                                        mt-1
                                        text-sm

                                        text-zinc-500
                                        dark:text-zinc-400
                                    "
                                >
                                    Paid by {getMemberName(expense.paidBy)}
                                    {" · "}
                                    {formatDate(expense.date)}
                                </p>
                                <p
                                    className="
                                        mt-1
                                        text-xs

                                        text-zinc-500
                                        dark:text-zinc-400
                                    "
                                >
                                    {formatSplitSummary(expense)}
                                </p>
                            </div>

                            <span
                                className="
                                    shrink-0
                                    font-semibold
                                    tabular-nums
                                "
                            >
                                {formatCurrency(parseAmount(expense.amount))}
                            </span>
                        </div>

                        {canDelete && (
                            <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<Trash2 size={14} />}
                                onClick={() => onDelete(expense)}
                            >
                                Delete
                            </Button>
                        )}
                    </li>
                ))}
            </ul>
        </Card>
    );
}

export default GroupExpenseList;
