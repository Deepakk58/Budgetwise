import { cn } from "../../lib/cn";
import {
    formatBalance,
    getBalanceClassName,
    getBalanceLabel,
} from "../../lib/groupUtils";

function BalanceDisplay({
    balance,
    showLabel = false,
    size = "md",
    className,
}) {
    return (
        <div className={cn("text-right", className)}>
            <span
                className={cn(
                    getBalanceClassName(balance),
                    size === "lg" && "text-lg",
                    size === "sm" && "text-sm"
                )}
            >
                {formatBalance(balance)}
            </span>

            {showLabel && (
                <p
                    className="
                        mt-0.5
                        text-xs

                        text-zinc-500
                        dark:text-zinc-400
                    "
                >
                    {getBalanceLabel(balance)}
                </p>
            )}
        </div>
    );
}

export default BalanceDisplay;
