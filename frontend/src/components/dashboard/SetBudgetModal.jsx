import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import { parseAmount } from "../../lib/format";

function SetBudgetModal({
    isOpen,
    onClose,
    categories = [],
    budgets = [],
    onSubmit,
    loading = false,
    categoriesLoading = false,
    categoriesError = false,
}) {
    const [amounts, setAmounts] = useState({});
    const [formError, setFormError] = useState("");

    useEffect(() => {
        if (!isOpen) return;

        const initialAmounts = {};

        for (const budget of budgets) {
            const categoryId = budget.category?._id;
            if (categoryId) {
                initialAmounts[categoryId] = String(parseAmount(budget.amount));
            }
        }

        setAmounts(initialAmounts);
        setFormError("");
    }, [isOpen, budgets]);

    const handleAmountChange = (categoryId, value) => {
        setAmounts((prev) => ({
            ...prev,
            [categoryId]: value,
        }));
        setFormError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const seenCategories = new Set();
        const payload = [];

        for (const category of categories) {
            const rawValue = amounts[category._id]?.trim();

            if (!rawValue) continue;

            const parsedAmount = Number(rawValue);

            if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
                setFormError(
                    `"${category.title}" must be a valid positive amount.`
                );
                return;
            }

            if (seenCategories.has(category._id)) {
                setFormError(`Duplicate budget entry for "${category.title}".`);
                return;
            }

            seenCategories.add(category._id);
            payload.push({
                category: category._id,
                amount: parsedAmount,
            });
        }

        if (payload.length === 0) {
            setFormError("Enter at least one budget amount to save.");
            return;
        }

        try {
            await onSubmit(payload);
            toast.success("Budgets saved successfully!");
            onClose();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Something went wrong while saving budgets."
            );
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            title="Set Budget"
            onClose={onClose}
        >
            {categoriesLoading ? (
                <div className="flex min-h-48 items-center justify-center">
                    <Spinner />
                </div>
            ) : categoriesError ? (
                <div className="space-y-4 text-center">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Unable to load categories. Please try again.
                    </p>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </div>
            ) : categories.length === 0 ? (
                <div className="space-y-4 text-center">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        No expense categories available yet.
                    </p>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Enter monthly limits for the categories you want to track.
                        Leave blank to skip a category.
                    </p>

                    <div
                        className="
                            max-h-80
                            space-y-4
                            overflow-y-auto
                            pr-1
                        "
                    >
                        {categories.map((category) => (
                            <Input
                                key={category._id}
                                label={category.title}
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Optional"
                                value={amounts[category._id] ?? ""}
                                onChange={(event) =>
                                    handleAmountChange(
                                        category._id,
                                        event.target.value
                                    )
                                }
                            />
                        ))}
                    </div>

                    {formError && (
                        <p className="error-text">
                            {formError}
                        </p>
                    )}

                    <div
                        className="
                            flex
                            flex-col-reverse
                            gap-3

                            pt-2

                            sm:flex-row
                            sm:justify-end
                        "
                    >
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="blue"
                            loading={loading}
                        >
                            Save Budgets
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}

export default SetBudgetModal;
