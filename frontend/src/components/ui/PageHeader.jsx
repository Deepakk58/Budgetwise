import { cn } from "../../lib/cn";

function PageHeader({
    title,
    subtitle,
    action,
    className,
}) {
    return (
        <header
            className={cn(
                `
                mb-10

                flex
                flex-col
                gap-6

                md:flex-row
                md:items-end
                md:justify-between
                `,
                className
            )}
        >
            <div className="space-y-2">

                <h1
                    className="
                    text-3xl
                    font-bold
                    tracking-tight

                    sm:text-4xl
                "
                >
                    {title}
                </h1>

                {subtitle && (
                    <p
                        className="
                        max-w-2xl

                        text-sm
                        leading-6

                        text-zinc-500
                        dark:text-zinc-400

                        sm:text-base
                    "
                    >
                        {subtitle}
                    </p>
                )}

            </div>

            {action && (
                <div className="shrink-0">
                    {action}
                </div>
            )}

        </header>
    );
}

export default PageHeader;