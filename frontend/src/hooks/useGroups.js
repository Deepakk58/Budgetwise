import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getGroups, createGroup } from "../api/groupApi";

function useGroups() {
    const queryClient = useQueryClient();

    const groupsQuery = useQuery({
        queryKey: ["groups"],
        queryFn: async () => {
            const response = await getGroups();
            return response.data.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: createGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
    });

    return {
        groupsQuery,
        createMutation,
        isLoading: groupsQuery.isLoading,
        isError: groupsQuery.isError,
        error: groupsQuery.error,
        refetch: groupsQuery.refetch,
    };
}

export default useGroups;
