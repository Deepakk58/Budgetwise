import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "../../lib/cn";

const buttonVariants = cva(
    `
        inline-flex
        items-center
        justify-center
        gap-2

        rounded-xl

        font-medium

        whitespace-nowrap
        select-none

        transition-all
        duration-200

        active:scale-[0.98]

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-blue-500
        focus-visible:ring-offset-2
        dark:focus-visible:ring-offset-zinc-950

        disabled:pointer-events-none
        disabled:cursor-not-allowed
        disabled:opacity-50

        cursor-pointer
    `,
    {
        variants: {
            variant: {
                primary: `
                    bg-zinc-900
                    text-white
                    hover:bg-zinc-800

                    dark:bg-white
                    dark:text-zinc-900
                    dark:hover:bg-zinc-200
                `,

                secondary: `
                    bg-zinc-100
                    text-zinc-900
                    hover:bg-zinc-200

                    dark:bg-zinc-800
                    dark:text-zinc-100
                    dark:hover:bg-zinc-700
                `,

                blue: `
                    bg-blue-600
                    text-white
                    hover:bg-blue-700

                    dark:bg-blue-500
                    dark:hover:bg-blue-600
                `,

                outline: `
                    border
                    border-zinc-300
                    bg-transparent

                    hover:bg-zinc-100

                    dark:border-zinc-700
                    dark:hover:bg-zinc-900
                `,

                ghost: `
                    bg-transparent
                    hover:bg-zinc-100

                    dark:hover:bg-zinc-800
                `,

                destructive: `
                    bg-red-600
                    text-white
                    hover:bg-red-700
                `,

                success: `
                    bg-emerald-600
                    text-white
                    hover:bg-emerald-700
                `,
            },

            size: {
                sm: "h-9 px-3 text-sm",
                md: "h-11 px-5 text-sm",
                lg: "h-12 px-6 text-base",
                icon: "h-11 w-11 p-0",
            },

            fullWidth: {
                true: "w-full",
                false: "",
            }
        },

        defaultVariants: {
            variant: "primary",
            size: "md",
            fullWidth: false,
            cursor: false,
        },
    }
);

function Button({
    children,
    onClick,
    type = "button",

    variant,
    size,

    fullWidth,
    cursor = false,

    disabled = false,
    loading = false,

    leftIcon,
    rightIcon,

    className,
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={cn(
                buttonVariants({
                    variant,
                    size,
                    fullWidth,
                    cursor,
                }),
                className
            )}
        >
            {loading ? (
                <>
                    <Loader2
                        size={16}
                        className="animate-spin"
                    />
                    Loading...
                </>
            ) : (
                <>
                    {leftIcon}
                    {children}
                    {rightIcon}
                </>
            )}
        </button>
    );
}

export default Button;