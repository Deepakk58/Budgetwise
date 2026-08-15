import Card from "../ui/Card";
import { cn } from "../../lib/cn";
import { formatCurrency } from "../../lib/format";

function SummaryCard({
    label,
    value,
    icon: Icon,
    tone = "default",
}) {
    const toneStyles = {
        default: {
            icon: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
            value: "text-zinc-900 dark:text-zinc-100",
        },
        income: {
            icon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
            value: "text-emerald-600 dark:text-emerald-400",
        },
        expense: {
            icon: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
            value: "text-red-600 dark:text-red-400",
        },
        savings: {
            icon: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
            value: "text-blue-600 dark:text-blue-400",
        },
    };

    const styles = toneStyles[tone] || toneStyles.default;

    return (
        <Card hover className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-3">
                    <p
                        className="
                            text-sm
                            font-medium

                            text-zinc-500
                            dark:text-zinc-400
                        "
                    >
                        {label}
                    </p>

                    <p
                        className={cn(
                            `
                                truncate
                                text-2xl
                                font-bold
                                tracking-tight

                                sm:text-3xl
                            `,
                            styles.value
                        )}
                    >
                        {formatCurrency(value)}
                    </p>
                </div>

                {Icon && (
                    <div
                        className={cn(
                            `
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center

                                rounded-xl
                            `,
                            styles.icon
                        )}
                    >
                        <Icon size={20} />
                    </div>
                )}
            </div>
        </Card>
    );
}

export default SummaryCard;
