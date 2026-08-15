function CenteredLayout({
    children,
    className = "",
}) {
    return (
        <div
            className={`
                relative

                flex
                min-h-full
                w-full

                items-center
                justify-center

                ${className}
            `}
        >
            <div
                className="
                    pointer-events-none

                    absolute
                    inset-0

                    -z-10

                    bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))]

                    from-zinc-200/60
                    via-transparent
                    to-transparent

                    dark:from-zinc-800/40
                "
            />

            {children}
        </div>
    );
}

export default CenteredLayout;