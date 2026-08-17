import toast from "react-hot-toast";
import { HandCoins } from "lucide-react";

import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import EmptyState from "../ui/EmptyState";
import {
    formatCurrency,
    formatDate,
    parseAmount,
} from "../../lib/format";
import { getMemberName } from "../../lib/groupUtils";

function SettleUpModal({
    isOpen,
    onClose,
    suggestions = [],
    history = [],
    loading = false,
    settlingId = null,
    onMarkPaid,
}) {
    const handleMarkPaid = async (suggestion) => {
        try {
            await onMarkPaid({
                paidBy: suggestion.from._id,
                paidTo: suggestion.to._id,
                amount: parseAmount(suggestion.amount),
            });
            toast.success("Settlement recorded!");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Something went wrong."
            );
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            title="Settle Up"
            onClose={onClose}
        >
            {loading ? (
                <div className="flex justify-center py-10">
                    <Spinner />
                </div>
            ) : (
                <div className="space-y-8">
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                            Suggested settlements
                        </h3>

                        {suggestions.length === 0 ? (
                            <EmptyState
                                icon={HandCoins}
                                title="All settled up"
                                description="No outstanding balances in this group."
                            />
                        ) : (
                            <ul className="space-y-3">
                                {suggestions.map((suggestion) => {
                                    const settlementKey = `${suggestion.from._id}-${suggestion.to._id}-${suggestion.amount}`;
                                    const isSettling =
                                        settlingId === settlementKey;

                                    return (
                                        <li
                                            key={settlementKey}
                                            className="
                                                flex
                                                flex-col
                                                gap-3

                                                rounded-xl

                                                border
                                                border-zinc-200

                                                px-4
                                                py-3

                                                sm:flex-row
                                                sm:items-center
                                                sm:justify-between

                                                dark:border-zinc-800
                                            "
                                        >
                                            <p className="text-sm">
                                                <span className="font-medium">
                                                    {getMemberName(suggestion.from)}
                                                </span>
                                                {" owes "}
                                                <span className="font-medium">
                                                    {getMemberName(suggestion.to)}
                                                </span>
                                                {" "}
                                                <span
                                                    className="
                                                        font-semibold
                                                        tabular-nums
                                                    "
                                                >
                                                    {formatCurrency(
                                                        parseAmount(suggestion.amount)
                                                    )}
                                                </span>
                                            </p>

                                            <Button
                                                variant="success"
                                                size="sm"
                                                loading={isSettling}
                                                onClick={() =>
                                                    handleMarkPaid(suggestion)
                                                }
                                            >
                                                Paid
                                            </Button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                            Settlement history
                        </h3>

                        {history.length === 0 ? (
                            <p
                                className="
                                    text-sm

                                    text-zinc-500
                                    dark:text-zinc-400
                                "
                            >
                                No settlements recorded yet.
                            </p>
                        ) : (
                            <ul
                                className="
                                    divide-y
                                    divide-zinc-200

                                    rounded-xl

                                    border
                                    border-zinc-200

                                    dark:divide-zinc-800
                                    dark:border-zinc-800
                                "
                            >
                                {history.map((settlement) => (
                                    <li
                                        key={settlement._id}
                                        className="px-4 py-3"
                                    >
                                        <p className="text-sm">
                                            <span className="font-medium">
                                                {getMemberName(settlement.paidBy)}
                                            </span>
                                            {" paid "}
                                            <span className="font-medium">
                                                {getMemberName(settlement.paidTo)}
                                            </span>
                                            {" "}
                                            <span
                                                className="
                                                    font-semibold
                                                    tabular-nums
                                                "
                                            >
                                                {formatCurrency(
                                                    parseAmount(settlement.amount)
                                                )}
                                            </span>
                                        </p>
                                        <p
                                            className="
                                                mt-1
                                                text-xs

                                                text-zinc-500
                                                dark:text-zinc-400
                                            "
                                        >
                                            {formatDate(settlement.date)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            )}
        </Modal>
    );
}

export default SettleUpModal;
