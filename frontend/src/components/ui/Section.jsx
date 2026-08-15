import { cn } from "../../lib/cn";

function Section({
    title,
    subtitle,
    action,
    children,
    className,
}) {
    return (
        <section
            className={cn(
                "space-y-6",
                className
            )}
        >
            {(title || action) && (

                <div
                    className="
                    flex
                    flex-col
                    gap-4

                    sm:flex-row
                    sm:items-end
                    sm:justify-between
                "
                >

                    <div>

                        {title && (
                            <h2
                                className="
                                text-xl
                                font-semibold
                                tracking-tight
                            "
                            >
                                {title}
                            </h2>
                        )}

                        {subtitle && (
                            <p
                                className="
                                mt-1

                                text-sm

                                text-zinc-500
                                dark:text-zinc-400
                            "
                            >
                                {subtitle}
                            </p>
                        )}

                    </div>

                    {action}

                </div>

            )}

            {children}

        </section>
    );
}

export default Section;