import { cn } from "./cn";
import { formatCurrency, parseAmount } from "./format";

export function getBalanceStatus(balance) {
    const value = parseAmount(balance);

    if (value > 0.001) return "receive";
    if (value < -0.001) return "owe";
    return "settled";
}

export function formatBalance(balance, { showSign = true } = {}) {
    const value = parseAmount(balance);
    const status = getBalanceStatus(value);
    const formatted = formatCurrency(Math.abs(value));

    if (status === "settled") {
        return formatted;
    }

    if (!showSign) {
        return formatted;
    }

    return status === "receive" ? `+${formatted}` : `-${formatted}`;
}

export function getBalanceClassName(balance, className) {
    const status = getBalanceStatus(balance);

    return cn(
        "font-semibold tabular-nums",
        status === "receive" && "text-emerald-600 dark:text-emerald-400",
        status === "owe" && "text-red-600 dark:text-red-400",
        status === "settled" && "text-zinc-500 dark:text-zinc-400",
        className
    );
}

export function getBalanceLabel(balance) {
    const status = getBalanceStatus(balance);

    if (status === "receive") return "You are owed";
    if (status === "owe") return "You owe";
    return "Settled up";
}

export function buildInviteUrl(inviteToken) {
    return `${window.location.origin}/groups/join/${inviteToken}`;
}

export function getMemberName(member) {
    return member?.name || member?.user?.username || "Unknown";
}
