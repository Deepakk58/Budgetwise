import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
} from "../api/expenseApi";
import { getCategories } from "../api/budgetApi";

function useExpenses() {
    const queryClient = useQueryClient();

    const expensesQuery = useQuery({
        queryKey: ["expenses"],
        queryFn: async () => {
            const response = await getExpenses();
            return response.data.data;
        },
    });

    const categoriesQuery = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await getCategories();
            return response.data.data;
        },
    });

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    };

    const addMutation = useMutation({
        mutationFn: addExpense,
        onSuccess: invalidate,
    });

    const editMutation = useMutation({
        mutationFn: ({ id, data }) => updateExpense(id, data),
        onSuccess: invalidate,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteExpense,
        onSuccess: invalidate,
    });

    return {
        expensesQuery,
        categoriesQuery,
        addMutation,
        editMutation,
        deleteMutation,
        isLoading: expensesQuery.isLoading || categoriesQuery.isLoading,
        isError: expensesQuery.isError || categoriesQuery.isError,
        error: expensesQuery.error || categoriesQuery.error,
        refetch: () => {
            expensesQuery.refetch();
            categoriesQuery.refetch();
        },
    };
}

export default useExpenses;
