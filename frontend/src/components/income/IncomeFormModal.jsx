import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { getTodayInputDate, toInputDate } from "../../lib/date";
import { parseAmount } from "../../lib/format";

function IncomeFormModal({
    isOpen,
    onClose,
    onSubmit,
    income = null,
    loading = false,
}) {
    const isEditing = Boolean(income);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            amount: "",
            date: getTodayInputDate(),
        },
    });

    useEffect(() => {
        if (!isOpen) return;

        if (income) {
            reset({
                name: income.name || "",
                amount: String(parseAmount(income.amount)),
                date: toInputDate(income.date),
            });
        } else {
            reset({
                name: "",
                amount: "",
                date: getTodayInputDate(),
            });
        }
    }, [isOpen, income, reset]);

    const submitForm = async (data) => {
        try {
            await onSubmit({
                name: data.name.trim(),
                amount: Number(data.amount),
                date: data.date,
            });

            toast.success(
                isEditing
                    ? "Income updated successfully!"
                    : "Income added successfully!"
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
            title={isEditing ? "Edit Income" : "Add Income"}
            onClose={onClose}
        >
            <form
                onSubmit={handleSubmit(submitForm)}
                className="space-y-5"
            >
                <Input
                    label="Source"
                    placeholder="e.g. Salary"
                    register={register("name", {
                        required: "Source is required",
                        minLength: {
                            value: 1,
                            message: "Source is required",
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
                        {isEditing ? "Save Changes" : "Add Income"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default IncomeFormModal;
