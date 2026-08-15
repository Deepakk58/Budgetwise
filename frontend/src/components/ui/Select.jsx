import { cn } from "../../lib/cn";

function Select({
    label,
    value,
    onChange,
    children,
    error,
    className = "",
    ...props
}) {
    return (
        <div className="space-y-2">

            {label && (
                <label className="label">
                    {label}
                </label>
            )}

            <select
                value={value}
                onChange={onChange}
                className={cn(
                    `
                    w-full
                    h-11

                    rounded-xl

                    border
                    border-zinc-300

                    bg-white

                    px-4

                    text-sm

                    transition-all
                    duration-200

                    outline-none

                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-500/10

                    dark:border-zinc-700
                    dark:bg-zinc-900
                    dark:text-zinc-100
                    `,
                    error &&
                        `
                        border-red-500
                        focus:border-red-500
                        focus:ring-red-500/10
                        `,
                    className
                )}
                {...props}
            >
                {children}
            </select>

            {error && (
                <p className="error-text">
                    {error.message}
                </p>
            )}
        </div>
    );
}

export default Select;