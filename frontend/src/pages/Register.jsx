import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { registerUser } from "../api/authApi";

import AuthCard from "../components/auth/AuthCard";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import FadeIn from "../components/ui/FadeIn";

function Register() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            await registerUser(data);

            toast.success("Account created successfully!");

            navigate("/login");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Registration failed."
            );
        }
    };

    return (
        <FadeIn>
            <AuthCard
                title="Create Account"
                subtitle="Create an account to start tracking scores."
                footer={
                    <>
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="
                            font-medium

                            text-zinc-900

                            hover:underline

                            dark:text-white
                            "
                        >
                            Login
                        </Link>
                    </>
                }
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <Input
                        label="Username"
                        placeholder="Choose a username"
                        register={register("username", {
                            required: "Username is required",
                            minLength: {
                                value: 3,
                                message: "Minimum 3 characters",
                            },
                        })}
                        error={errors.username}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Create a password"
                        register={register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message:
                                    "Password must be at least 8 characters",
                            },
                            pattern: {
                                value:
                                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^()_\-+=\[\]{}|\\:;"'<>,./~`]).{8,}$/,
                                message:
                                    "Password must contain at least one letter, one number and one special character",
                            },
                        })}
                        error={errors.password}
                    />

                    <Button
                        type="submit"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        fullWidth
                    >
                        Create Account
                    </Button>
                </form>
            </AuthCard>
        </FadeIn>
    );
}

export default Register;