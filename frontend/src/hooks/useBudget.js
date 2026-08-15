import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
    getCategories,
    setMultipleBudgets,
} from "../api/budgetApi";

function useBudget() {
    const queryClient = useQueryClient();

    const categoriesQuery = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await getCategories();
            return response.data.data;
        },
    });

    const invalidateDashboard = () => {
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    };

    const setMultipleMutation = useMutation({
        mutationFn: (budgets) => setMultipleBudgets(budgets),
        onSuccess: invalidateDashboard,
    });

    return {
        categoriesQuery,
        setMultipleMutation,
        isLoadingCategories: categoriesQuery.isLoading,
        isCategoriesError: categoriesQuery.isError,
        categoriesError: categoriesQuery.error,
    };
}

export default useBudget;
