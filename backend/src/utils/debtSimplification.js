import { MaxHeap } from "./maxHeap.js";

const SETTLEMENT_EPSILON = 0.001;

const compareBalances = (left, right) => {
    const amountDifference = left.amount - right.amount;

    if (amountDifference !== 0) {
        return amountDifference;
    }

    // Keep equal balances deterministic without changing the primary
    // amount-based max-heap ordering.
    return right.memberId.localeCompare(left.memberId);
};

const simplifyDebts = (balances) => {
    const debtors = new MaxHeap(compareBalances);
    const creditors = new MaxHeap(compareBalances);

    for (const [memberId, balance] of Object.entries(balances)) {
        const amount = Number(balance);

        if (amount < -SETTLEMENT_EPSILON) {
            debtors.push({
                memberId,
                amount: -amount
            });
        } else if (amount > SETTLEMENT_EPSILON) {
            creditors.push({
                memberId,
                amount
            });
        }
    }

    const transactions = [];

    while (!debtors.isEmpty() && !creditors.isEmpty()) {
        const debtor = debtors.pop();
        const creditor = creditors.pop();
        const settledAmount = Math.min(debtor.amount, creditor.amount);

        transactions.push({
            from: debtor.memberId,
            to: creditor.memberId,
            amount: Number(settledAmount.toFixed(2))
        });

        debtor.amount -= settledAmount;
        creditor.amount -= settledAmount;

        if (debtor.amount > SETTLEMENT_EPSILON) {
            debtors.push(debtor);
        }

        if (creditor.amount > SETTLEMENT_EPSILON) {
            creditors.push(creditor);
        }
    }

    return transactions;
};

export { simplifyDebts };
