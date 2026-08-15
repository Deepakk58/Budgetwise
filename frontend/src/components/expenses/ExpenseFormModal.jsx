import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { getTodayInputDate, toInputDate } from "../../lib/date";
import { parseAmount } from "../../lib/format";

function ExpenseFormModal({
    isOpen,
    onClose,
    onSubmit,
    categories = [],
    expense = null,
    loading = false,
}) {
    const isEditing = Boolean(expense);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            amount: "",
            category: "",
            date: getTodayInputDate(),
        },
    });

    useEffect(() => {
        if (!isOpen) return;

        if (expense) {
            reset({
                name: expense.name || "",
                amount: String(parseAmount(expense.amount)),
                category: expense.category?.title || "",
                date: toInputDate(expense.date),
            });
        } else {
            reset({
                name: "",
                amount: "",
                category: categories[0]?.title || "",
                date: getTodayInputDate(),
            });
        }
    }, [isOpen, expense, categories, reset]);

    const submitForm = async (data) => {
        try {
            await onSubmit({
                name: data.name.trim(),
                amount: Number(data.amount),
                category: data.category,
                date: data.date,
            });

            toast.success(
                isEditing
                    ? "Expense updated successfully!"
                    : "Expense added successfully!"
            );

            onClose();
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
            title={isEditing ? "Edit Expense" : "Add Expense"}
            onClose={onClose}
        >
            <form
                onSubmit={handleSubmit(submitForm)}
                className="space-y-5"
            >
                <Input
                    label="Name"
                    placeholder="e.g. Groceries"
                    register={register("name", {
                        required: "Name is required",
                        minLength: {
                            value: 1,
                            message: "Name is required",
                        },
                    })}
                    error={errors.name}
                />

                <Input
                    label="Amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    register={register("amount", {
                        required: "Amount is required",
                        min: {
                            value: 0,
                            message: "Amount must be positive",
                        },
                    })}
                    error={errors.amount}
                />

                <Select
                    label="Category"
                    {...register("category", {
                        required: "Category is required",
                    })}
                    error={errors.category}
                >
                    <option value="" disabled>
                        Select a category
                    </option>
                    {categories.map((category) => (
                        <option
                            key={category._id}
                            value={category.title}
                        >
                            {category.title}
                        </option>
                    ))}
                </Select>

                <Input
                    label="Date"
                    type="date"
                    register={register("date", {
                        required: "Date is required",
                    })}
                    error={errors.date}
                />

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
                        {isEditing ? "Save Changes" : "Add Expense"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default ExpenseFormModal;
