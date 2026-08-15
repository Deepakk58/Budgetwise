function Avatar({
    user,
    size = "md",
    online = false,
    className = "",
}) {

    const sizes = {
        sm: "h-7 w-7 text-xs",
        md: "h-8 w-8 text-sm",
        lg: "h-10 w-10 text-base",
    };

    return (
        <div
            title={user?.username}
            className={`
                ${sizes[size]}
                flex
                items-center
                justify-center
                rounded-full
                bg-blue-600
                font-semibold
                text-white
                select-none
                shrink-0
                relative
                ${className}
            `}
        >
            {user?.username?.charAt(0).toUpperCase()}

            {online && (
                <span
                    aria-label="Online"
                    className="absolute bottom-0 left-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-(--background)"
                />
            )}
        </div>
    );
}

export default Avatar;
