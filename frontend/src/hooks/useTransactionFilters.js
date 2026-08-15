import { useMemo } from "react";

import { parseAmount } from "../lib/format";

export const PAGE_SIZE = 10;

export const SORT_OPTIONS = [
    { value: "date-desc", label: "Date (newest)" },
    { value: "date-asc", label: "Date (oldest)" },
    { value: "amount-desc", label: "Amount (high to low)" },
    { value: "amount-asc", label: "Amount (low to high)" },
];

export function filterAndSortTransactions(items, filters) {
    const {
        category = "",
        startDate = "",
        endDate = "",
        sortBy = "date-desc",
    } = filters;

    let result = [...items];

    if (category) {
        result = result.filter(
            (item) => item.category?.title === category
        );
    }

    if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        result = result.filter(
            (item) => new Date(item.date) >= start
        );
    }

    if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        result = result.filter(
            (item) => new Date(item.date) <= end
        );
    }

    result.sort((a, b) => {
        switch (sortBy) {
            case "date-asc":
                return new Date(a.date) - new Date(b.date);
            case "amount-desc":
                return parseAmount(b.amount) - parseAmount(a.amount);
            case "amount-asc":
                return parseAmount(a.amount) - parseAmount(b.amount);
            case "date-desc":
            default:
                return new Date(b.date) - new Date(a.date);
        }
    });

    return result;
}

export function paginateItems(items, page, pageSize = PAGE_SIZE) {
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const start = (safePage - 1) * pageSize;

    return {
        items: items.slice(start, start + pageSize),
        totalPages,
        currentPage: safePage,
        totalItems: items.length,
    };
}

export function useFilteredTransactions(items, filters, page) {
    return useMemo(() => {
        const filtered = filterAndSortTransactions(items || [], filters);
        return paginateItems(filtered, page);
    }, [items, filters, page]);
}
