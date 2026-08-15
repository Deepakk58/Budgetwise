import { cn } from "../../lib/cn";

function Textarea({
    label,
    placeholder,

    register,

    value,
    onChange,
    onKeyDown,

    rows = 4,

    disabled = false,
    autoFocus = false,

    error,

    className = "",
}) {
    return (
        <div className="space-y-2">

            {label && (
                <label className="label">
                    {label}
                </label>
            )}

            <textarea
                placeholder={placeholder}
                rows={rows}

                {...register}

                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}

                disabled={disabled}
                autoFocus={autoFocus}

                className={cn(
                    `
                    textarea-base
                    transition-default
                    `,

                    error && "input-error",

                    className
                )}
            />

            {error && (
                <p className="error-text">
                    {error.message}
                </p>
            )}

        </div>
    );
}

export default Textarea;