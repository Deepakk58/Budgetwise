import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { getTodayInputDate } from "../../lib/date";
import { formatCurrency, parseAmount } from "../../lib/format";
import { getMemberName } from "../../lib/groupUtils";
import { cn } from "../../lib/cn";

const SPLIT_TYPES = [
    { value: "equal", label: "Equal" },
    { value: "exact", label: "Exact" },
    { value: "percent", label: "Percentage" },
];

function AddGroupExpenseModal({
    isOpen,
    onClose,
    onSubmit,
    members = [],
    loading = false,
}) {
    const [participants, setParticipants] = useState([]);
    const [splitType, setSplitType] = useState("equal");
    const [exactAmounts, setExactAmounts] = useState({});
    const [percentages, setPercentages] = useState({});

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: "",
            amount: "",
            paidBy: "",
            date: getTodayInputDate(),
        },
    });

    const watchedAmount = watch("amount");

    useEffect(() => {
        if (!isOpen) return;

        const defaultPaidBy = members[0]?._id || "";

        reset({
            title: "",
            amount: "",
            paidBy: defaultPaidBy,
            date: getTodayInputDate(),
        });

        setSplitType("equal");
        setParticipants(members.map((member) => member._id));
        setExactAmounts({});
        setPercentages({});
    }, [isOpen, members, reset]);

    useEffect(() => {
        if (!isOpen || splitType !== "exact") return;

        const total = parseAmount(watchedAmount);
        const count = participants.length;

        if (!total || !count) {
            setExactAmounts({});
            return;
        }

        const equalShare = Number((total / count).toFixed(2));
        const nextAmounts = {};

        participants.forEach((memberId, index) => {
            if (index === count - 1) {
                const assigned = equalShare * (count - 1);
                nextAmounts[memberId] = Number((total - assigned).toFixed(2));
            } else {
                nextAmounts[memberId] = equalShare;
            }
        });

        setExactAmounts(nextAmounts);
    }, [participants, splitType, watchedAmount, isOpen]);

    useEffect(() => {
        if (!isOpen || splitType !== "percent") return;

        const count = participants.length;

        if (!count) {
            setPercentages({});
            return;
        }

        const equalPercent = Number((100 / count).toFixed(2));
        const nextPercentages = {};

        participants.forEach((memberId, index) => {
            if (index === count - 1) {
                const assigned = equalPercent * (count - 1);
                nextPercentages[memberId] = Number((100 - assigned).toFixed(2));
            } else {
                nextPercentages[memberId] = equalPercent;
            }
        });

        setPercentages(nextPercentages);
    }, [participants, splitType, isOpen]);

    const exactTotal = useMemo(
        () =>
            participants.reduce(
                (sum, memberId) =>
                    sum + parseAmount(exactAmounts[memberId]),
                0
            ),
        [participants, exactAmounts]
    );

    const percentTotal = useMemo(
        () =>
            participants.reduce(
                (sum, memberId) =>
                    sum + parseAmount(percentages[memberId]),
                0
            ),
        [participants, percentages]
    );

    const expenseTotal = parseAmount(watchedAmount);
    const exactMismatch =
        splitType === "exact" &&
        participants.length > 0 &&
        Math.abs(exactTotal - expenseTotal) > 0.01;

    const toggleParticipant = (memberId) => {
        setParticipants((current) => {
            if (current.includes(memberId)) {
                return current.filter((id) => id !== memberId);
            }

            return [...current, memberId];
        });
    };

    const submitForm = async (data) => {
        if (participants.length === 0) {
            toast.error("Select at least one participant.");
            return;
        }

        if (splitType === "exact" && exactMismatch) {
            toast.error("Split amounts must equal the expense total.");
            return;
        }

        if (splitType === "percent" && percentTotal <= 0) {
            toast.error("Total percentage must be greater than zero.");
            return;
        }

        const payload = {
            title: data.title.trim(),
            amount: Number(data.amount),
            paidBy: data.paidBy,
            date: data.date,
            splitType,
            participants,
        };

        if (splitType === "exact") {
            payload.splitAmounts = Object.fromEntries(
                participants.map((memberId) => [
                    memberId,
                    parseAmount(exactAmounts[memberId]),
                ])
            );
        }

        if (splitType === "percent") {
            payload.percentages = Object.fromEntries(
                participants.map((memberId) => [
                    memberId,
                    parseAmount(percentages[memberId]),
                ])
            );
        }

        try {
            await onSubmit(payload);
            toast.success("Group expense added successfully!");
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
            title="Add Group Expense"
            onClose={onClose}
            className="max-h-[90vh] overflow-y-auto scrollbar-hide"
        >
            <form
                onSubmit={handleSubmit(submitForm)}
                className="space-y-5"
            >
                <Input
                    label="Expense title"
                    placeholder="e.g. Dinner"
                    register={register("title", {
                        required: "Title is required",
                    })}
                    error={errors.title}
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
                            value: 0.01,
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

                <Select
                    label="Paid by"
                    {...register("paidBy", {
                        required: "Select who paid",
                    })}
                    error={errors.paidBy}
                >
                    <option value="" disabled>
                        Select a member
                    </option>
                    {members.map((member) => (
                        <option key={member._id} value={member._id}>
                            {getMemberName(member)}
                        </option>
                    ))}
                </Select>

                <div className="space-y-3">
                    <p className="label">Participants</p>

                    <div
                        className="
                            max-h-40
                            space-y-2
                            overflow-y-auto

                            rounded-xl

                            border
                            border-zinc-200

                            p-3

                            dark:border-zinc-800
                        "
                    >
                        {members.map((member) => (
                            <label
                                key={member._id}
                                className="
                                    flex
                                    cursor-pointer
                                    items-center
                                    gap-3

                                    rounded-lg

                                    px-2
                                    py-1.5

                                    hover:bg-zinc-50

                                    dark:hover:bg-zinc-900
                                "
                            >
                                <input
                                    type="checkbox"
                                    checked={participants.includes(member._id)}
                                    onChange={() =>
                                        toggleParticipant(member._id)
                                    }
                                    className="
                                        h-4
                                        w-4

                                        rounded

                                        border-zinc-300

                                        text-blue-600

                                        focus:ring-blue-500
                                    "
                                />
                                <span className="text-sm">
                                    {getMemberName(member)}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <Select
                    label="Split type"
                    value={splitType}
                    onChange={(event) =>
                        setSplitType(event.target.value)
                    }
                >
                    {SPLIT_TYPES.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </Select>

                {splitType === "equal" && participants.length > 0 && (
                    <p
                        className="
                            text-sm

                            text-zinc-500
                            dark:text-zinc-400
                        "
                    >
                        {formatCurrency(
                            expenseTotal / participants.length
                        )}{" "}
                        per person ({participants.length} participants)
                    </p>
                )}

                {splitType === "exact" && participants.length > 0 && (
                    <div className="space-y-3">
                        {participants.map((memberId) => {
                            const member = members.find(
                                (item) => item._id === memberId
                            );

                            return (
                                <Input
                                    key={memberId}
                                    label={getMemberName(member)}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={exactAmounts[memberId] ?? ""}
                                    onChange={(event) =>
                                        setExactAmounts((current) => ({
                                            ...current,
                                            [memberId]: event.target.value,
                                        }))
                                    }
                                />
                            );
                        })}

                        <p
                            className={cn(
                                "text-sm font-medium",
                                exactMismatch
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-zinc-500 dark:text-zinc-400"
                            )}
                        >
                            Total: {formatCurrency(exactTotal)}
                            {" / "}
                            {formatCurrency(expenseTotal)}
                            {exactMismatch && " — amounts must match"}
                        </p>
                    </div>
                )}

                {splitType === "percent" && participants.length > 0 && (
                    <div className="space-y-3">
                        {participants.map((memberId) => {
                            const member = members.find(
                                (item) => item._id === memberId
                            );

                            return (
                                <Input
                                    key={memberId}
                                    label={`${getMemberName(member)} (%)`}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={percentages[memberId] ?? ""}
                                    onChange={(event) =>
                                        setPercentages((current) => ({
                                            ...current,
                                            [memberId]: event.target.value,
                                        }))
                                    }
                                />
                            );
                        })}

                        <p
                            className={cn(
                                "text-sm font-medium",
                                percentTotal <= 0
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-zinc-500 dark:text-zinc-400"
                            )}
                        >
                            Total: {percentTotal.toFixed(2)}%
                        </p>
                    </div>
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
                        Add Expense
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default AddGroupExpenseModal;
