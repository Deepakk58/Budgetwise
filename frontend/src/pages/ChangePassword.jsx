import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import useChangePassword from "../hooks/useChangePassword";

import AuthCard from "../components/auth/AuthCard";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import FadeIn from "../components/ui/FadeIn";

function ChangePassword() {
    const { updatePassword, loading } = useChangePassword();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    const newPassword = watch("newPassword");

    const onSubmit = async (data) => {
        if (data.oldPassword === data.newPassword) {
            toast.error(
                "New password must be different from the current password."
            );
            return;
        }

        try {
            await updatePassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            });

            toast.success("Password changed successfully!");
            reset();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to change password."
            );
        }
    };

    return (
        <FadeIn>
            <AuthCard
                title="Change Password"
                subtitle="Keep your account secure by updating your password."
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <Input
                        label="Current Password"
                        type="password"
                        placeholder="Enter your current password"
                        register={register("oldPassword", {
                            required: "Current password is required",
                        })}
                        error={errors.oldPassword}
                    />

                    <Input
                        label="New Password"
                        type="password"
                        placeholder="Enter a new password"
                        register={register("newPassword", {
                            required: "New password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters",
                            },
                            pattern: {
                                value:
                                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^()_\-+=\[\]{}|\\:;"'<>,./~`]).{8,}$/,
                                message:
                                    "Password must contain at least one letter, one number and one special character",
                            },
                        })}
                        error={errors.newPassword}
                    />

                    <Input
                        label="Confirm New Password"
                        type="password"
                        placeholder="Confirm your new password"
                        register={register("confirmPassword", {
                            required: "Please confirm your new password",
                            validate: (value) =>
                                value === newPassword ||
                                "Passwords do not match",
                        })}
                        error={errors.confirmPassword}
                    />

                    <Button
                        type="submit"
                        loading={loading}
                        disabled={loading}
                        fullWidth
                    >
                        Change Password
                    </Button>
                </form>
            </AuthCard>
        </FadeIn>
    );
}

export default ChangePassword;