function Divider({
    className = "",
}) {
    return (
        <hr
            className={`
                border-0
                border-t
                border-zinc-200

                dark:border-zinc-800

                ${className}
            `}
        />
    );
}

export default Divider;