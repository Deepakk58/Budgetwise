import { Pencil, Trash2, TrendingUp } from "lucide-react";

import Card from "../ui/Card";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import {
    formatCurrency,
    formatDate,
    parseAmount,
} from "../../lib/format";

function IncomeList({
    incomes,
    onEdit,
    onDelete,
}) {
    if (incomes.length === 0) {
        return (
            <EmptyState
                icon={TrendingUp}
                title="No income found"
                description="Try adjusting your filters or add a new income record."
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
                            <th className="px-5 py-3 font-medium">Source</th>
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
                        {incomes.map((income) => (
                            <tr key={income._id}>
                                <td className="px-5 py-4 font-medium">
                                    {income.name}
                                </td>
                                <td className="px-5 py-4">
                                    {formatDate(income.date)}
                                </td>
                                <td
                                    className="
                                        px-5
                                        py-4

                                        text-right
                                        font-semibold
                                        tabular-nums

                                        text-emerald-600
                                        dark:text-emerald-400
                                    "
                                >
                                    +{formatCurrency(parseAmount(income.amount))}
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(income)}
                                            aria-label={`Edit ${income.name}`}
                                        >
                                            <Pencil size={16} />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete(income)}
                                            aria-label={`Delete ${income.name}`}
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
                {incomes.map((income) => (
                    <li
                        key={income._id}
                        className="space-y-3 p-4"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="truncate font-medium">
                                    {income.name}
                                </p>
                                <p
                                    className="
                                        mt-1
                                        text-sm

                                        text-zinc-500
                                        dark:text-zinc-400
                                    "
                                >
                                    {formatDate(income.date)}
                                </p>
                            </div>

                            <span
                                className="
                                    shrink-0
                                    font-semibold
                                    tabular-nums

                                    text-emerald-600
                                    dark:text-emerald-400
                                "
                            >
                                +{formatCurrency(parseAmount(income.amount))}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<Pencil size={14} />}
                                onClick={() => onEdit(income)}
                            >
                                Edit
                            </Button>

                            <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<Trash2 size={14} />}
                                onClick={() => onDelete(income)}
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

export default IncomeList;
