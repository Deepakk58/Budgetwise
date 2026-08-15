import { Pencil, Trash2, TrendingDown } from "lucide-react";

import Card from "../ui/Card";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import {
    formatCurrency,
    formatDate,
    parseAmount,
} from "../../lib/format";

function ExpenseList({
    expenses,
    onEdit,
    onDelete,
}) {
    if (expenses.length === 0) {
        return (
            <EmptyState
                icon={TrendingDown}
                title="No expenses found"
                description="Try adjusting your filters or add a new expense."
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
                            <th className="px-5 py-3 font-medium">Name</th>
                            <th className="px-5 py-3 font-medium">Category</th>
                            <th className="px-5 py-3 font-medium">Date</th>
                            <th className="px-5 py-3 font-medium text-right">Amount</th>
                            <th className="px-5 py-3 font-medium text-right">Actions</th>
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
                                    {expense.name}
                                </td>
                                <td className="px-5 py-4">
                                    {expense.category?.title || "Uncategorized"}
                                </td>
                                <td className="px-5 py-4">
                                    {formatDate(expense.date)}
                                </td>
                                <td
                                    className="
                                        px-5
                                        py-4

                                        text-right
                                        font-semibold
                                        tabular-nums

                                        text-red-600
                                        dark:text-red-400
                                    "
                                >
                                    -{formatCurrency(parseAmount(expense.amount))}
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(expense)}
                                            aria-label={`Edit ${expense.name}`}
                                        >
                                            <Pencil size={16} />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete(expense)}
                                            aria-label={`Delete ${expense.name}`}
                                        >
                                            <Trash2
                                                size={16}
                                                className="text-red-600 dark:text-red-400"
                                            />
                                        </Button>
                                    </div>
                                </td>
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
                                    {expense.name}
                                </p>
                                <p
                                    className="
                                        mt-1
                                        text-sm

                                        text-zinc-500
                                        dark:text-zinc-400
                                    "
                                >
                                    {expense.category?.title || "Uncategorized"}
                                    {" · "}
                                    {formatDate(expense.date)}
                                </p>
                            </div>

                            <span
                                className="
                                    shrink-0
                                    font-semibold
                                    tabular-nums

                                    text-red-600
                                    dark:text-red-400
                                "
                            >
                                -{formatCurrency(parseAmount(expense.amount))}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<Pencil size={14} />}
                                onClick={() => onEdit(expense)}
                            >
                                Edit
                            </Button>

                            <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<Trash2 size={14} />}
                                onClick={() => onDelete(expense)}
                            >
                                Delete
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
}

export default ExpenseList;
