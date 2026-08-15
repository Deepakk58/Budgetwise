import Button from "../ui/Button";

function TransactionPagination({
    currentPage,
    totalPages,
    totalItems,
    onPageChange,
}) {
    if (totalItems === 0) {
        return null;
    }

    return (
        <div
            className="
                flex
                flex-col
                gap-3

                sm:flex-row
                sm:items-center
                sm:justify-between
            "
        >
            <p
                className="
                    text-sm

                    text-zinc-500
                    dark:text-zinc-400
                "
            >
                Page {currentPage} of {totalPages}
                {" · "}
                {totalItems} record{totalItems === 1 ? "" : "s"}
            </p>

            <div className="flex items-center gap-2">
                <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    Previous
                </Button>

                <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}

export default TransactionPagination;
