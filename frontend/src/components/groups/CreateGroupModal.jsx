import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

function CreateGroupModal({
    isOpen,
    onClose,
    onSubmit,
    loading = false,
}) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
        if (isOpen) {
            reset({ name: "" });
        }
    }, [isOpen, reset]);

    const submitForm = async (data) => {
        try {
            await onSubmit({ name: data.name.trim() });
            toast.success("Group created successfully!");
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
            title="Create Group"
            onClose={onClose}
        >
            <form
                onSubmit={handleSubmit(submitForm)}
                className="space-y-5"
            >
                <Input
                    label="Group name"
                    placeholder="e.g. Trip to Goa"
                    register={register("name", {
                        required: "Group name is required",
                        minLength: {
                            value: 1,
                            message: "Group name is required",
                        },
                    })}
                    error={errors.name}
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
                        Create
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default CreateGroupModal;
