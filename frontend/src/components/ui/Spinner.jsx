function Spinner({
    size = "md",
    fullScreen = false,
}) {
    const sizes = {
        sm: "h-5 w-5",
        md: "h-9 w-9",
        lg: "h-14 w-14",
    };

    const spinner = (
        <div
            className={`
                animate-spin

                rounded-full

                border-[3px]

                border-zinc-300
                border-t-zinc-900

                dark:border-zinc-700
                dark:border-t-white

                ${sizes[size]}
            `}
        />
    );

    if (fullScreen) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                {spinner}
            </div>
        );
    }

    return (
        <div className="flex justify-center py-10">
            {spinner}
        </div>
    );
}

export default Spinner;