import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
    getGroupDetails,
    refreshInvite,
} from "../api/groupApi";
import {
    addGroupExpense,
    deleteGroupExpense,
} from "../api/groupExpenseApi";
import {
    getSettlementSuggestions,
    getSettlementHistory,
    recordSettlement,
} from "../api/settlementApi";

function useGroupDetails(groupId, { enableSettlements = false } = {}) {
    const queryClient = useQueryClient();

    const invalidateGroup = () => {
        queryClient.invalidateQueries({
            queryKey: ["group", groupId],
        });
        queryClient.invalidateQueries({
            queryKey: ["groups"],
        });
        queryClient.invalidateQueries({
            queryKey: ["settlement-suggestions", groupId],
        });
        queryClient.invalidateQueries({
            queryKey: ["settlement-history", groupId],
        });
    };

    const groupQuery = useQuery({
        queryKey: ["group", groupId],
        queryFn: async () => {
            const response = await getGroupDetails(groupId);
            return response.data.data;
        },
        enabled: Boolean(groupId),
    });

    const suggestionsQuery = useQuery({
        queryKey: ["settlement-suggestions", groupId],
        queryFn: async () => {
            const response = await getSettlementSuggestions(groupId);
            return response.data.data;
        },
        enabled: Boolean(groupId) && enableSettlements,
    });

    const historyQuery = useQuery({
        queryKey: ["settlement-history", groupId],
        queryFn: async () => {
            const response = await getSettlementHistory(groupId);
            return response.data.data;
        },
        enabled: Boolean(groupId) && enableSettlements,
    });

    const addExpenseMutation = useMutation({
        mutationFn: (data) => addGroupExpense(groupId, data),
        onSuccess: invalidateGroup,
    });

    const deleteExpenseMutation = useMutation({
        mutationFn: (expenseId) =>
            deleteGroupExpense(groupId, expenseId),
        onSuccess: invalidateGroup,
    });

    const refreshInviteMutation = useMutation({
        mutationFn: () => refreshInvite(groupId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["group", groupId],
            });
        },
    });

    const recordSettlementMutation = useMutation({
        mutationFn: (data) => recordSettlement(groupId, data),
        onSuccess: invalidateGroup,
    });

    return {
        groupQuery,
        suggestionsQuery,
        historyQuery,
        addExpenseMutation,
        deleteExpenseMutation,
        refreshInviteMutation,
        recordSettlementMutation,
        isLoading: groupQuery.isLoading,
        isError: groupQuery.isError,
        error: groupQuery.error,
        refetch: groupQuery.refetch,
        refetchSettlements: () => {
            suggestionsQuery.refetch();
            historyQuery.refetch();
        },
    };
}

export default useGroupDetails;
