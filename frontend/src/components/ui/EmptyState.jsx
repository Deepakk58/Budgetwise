import { Inbox } from "lucide-react";
import Card from "./Card";

function EmptyState({
    title,
    description,
    icon,
    action,
}) {
    const Icon = icon || Inbox;

    return (
        <Card>

            <div
                className="
                flex
                min-h-72
                flex-col
                items-center
                justify-center

                text-center
            "
            >

                <div
                    className="
                    mb-5

                    flex
                    h-16
                    w-16
                    items-center
                    justify-center

                    rounded-2xl

                    bg-zinc-100

                    dark:bg-zinc-800
                "
                >

                    <Icon
                        size={30}
                        className="
                        text-zinc-500
                        dark:text-zinc-400
                    "
                    />

                </div>

                <h2
                    className="
                    text-2xl
                    font-semibold
                    tracking-tight
                "
                >
                    {title}
                </h2>

                {description && (

                    <p
                        className="
                        mt-3

                        max-w-md

                        text-sm
                        leading-6

                        text-zinc-500
                        dark:text-zinc-400
                    "
                    >
                        {description}
                    </p>

                )}

                {action && (

                    <div className="mt-6">

                        {action}

                    </div>

                )}

            </div>

        </Card>
    );
}

export default EmptyState;