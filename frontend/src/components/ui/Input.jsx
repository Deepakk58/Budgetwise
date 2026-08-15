import { cn } from "../../lib/cn";

function Input({
    label,
    type = "text",
    placeholder,

    register,

    value,
    onChange,
    onKeyDown,

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

            <input
                type={type}
                placeholder={placeholder}

                {...register}

                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}

                className={cn(

                    `
                    input-base

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

export default Input;