import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
    getIncomes,
    addIncome,
    updateIncome,
    deleteIncome,
} from "../api/incomeApi";

function useIncomes() {
    const queryClient = useQueryClient();

    const incomesQuery = useQuery({
        queryKey: ["incomes"],
        queryFn: async () => {
            const response = await getIncomes();
            return response.data.data;
        },
    });

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["incomes"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    };

    const addMutation = useMutation({
        mutationFn: addIncome,
        onSuccess: invalidate,
    });

    const editMutation = useMutation({
        mutationFn: ({ id, data }) => updateIncome(id, data),
        onSuccess: invalidate,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteIncome,
        onSuccess: invalidate,
    });

    return {
        incomesQuery,
        addMutation,
        editMutation,
        deleteMutation,
        isLoading: incomesQuery.isLoading,
        isError: incomesQuery.isError,
        error: incomesQuery.error,
        refetch: () => incomesQuery.refetch(),
    };
}

export default useIncomes;
