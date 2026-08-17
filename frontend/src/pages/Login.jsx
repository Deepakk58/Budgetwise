import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { loginUser } from "../api/authApi";
import useAuth from "../hooks/useAuth.js";

import AuthCard from "../components/auth/AuthCard";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import FadeIn from "../components/ui/FadeIn";

function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const navigate = useNavigate();
    const { setUser } = useAuth();

    const onSubmit = async (data) => {
        try {
            const response = await loginUser(data);

            setUser(response.data.data.user);

            toast.success("Logged in successfully!");

            navigate("/home");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Something went wrong."
            );
        }
    };

    return (
        <FadeIn>
            <AuthCard
                title="Welcome Back"
                subtitle="Login to continue to your account."
                footer={
                    <>
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="
                            font-medium
                            text-zinc-900
                            hover:underline

                            dark:text-white
                            "
                        >
                            Register
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
                        placeholder="Enter your username"
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
                        placeholder="Enter your password"
                        register={register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Minimum 8 characters",
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
                        Sign In
                    </Button>
                </form>
            </AuthCard>
        </FadeIn>
    );
}

export default Login;