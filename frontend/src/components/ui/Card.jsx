import { cn } from "../../lib/cn";

function Card({
    children,
    className,
    hover = false,
}) {

    return (

        <div
            className={cn(

                `
                card-base

                p-6

                shadow-card

                transition-default
                `,

                hover &&
                `
                hover:-translate-y-1

                hover:shadow-card-hover
                `,

                className

            )}
        >

            {children}

        </div>

    );

}

export default Card;