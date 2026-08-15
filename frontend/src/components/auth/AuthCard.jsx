import Card from "../ui/Card";
import CenteredLayout from "../layout/CenteredLayout";

function AuthCard({
    title,
    subtitle,
    children,
    footer,
}) {
    return (
        <CenteredLayout>

            <div className="w-full max-w-md">

                <Card
                    className="
                    p-8

                    sm:p-10

                    shadow-xl

                    shadow-zinc-200/50

                    dark:shadow-none
                "
                >

                    <div
                        className="
                        mb-8

                        text-center
                    "
                    >

                        <h1
                            className="
                            text-3xl
                            font-bold
                            tracking-tight
                            "
                        >
                            {title}
                        </h1>

                        {subtitle && (

                            <p
                                className="
                                mt-3

                                text-sm
                                leading-6

                                text-zinc-500

                                dark:text-zinc-400
                            "
                            >
                                {subtitle}
                            </p>

                        )}

                    </div>


                    {children}


                    {footer && (

                        <div
                            className="
                            mt-8

                            border-t

                            border-zinc-200

                            pt-6

                            text-center

                            text-sm

                            text-zinc-500

                            dark:border-zinc-800
                            dark:text-zinc-400
                        "
                        >
                            {footer}
                        </div>

                    )}

                </Card>

            </div>

        </CenteredLayout>
    );
}

export default AuthCard;