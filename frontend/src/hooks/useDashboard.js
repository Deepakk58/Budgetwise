import { useQuery } from "@tanstack/react-query";

import { getDashboard } from "../api/dashboardApi";
import {
    getBudgets,
    getCurrentMonthBudgetData,
} from "../api/budgetApi";

function useDashboard() {
    const dashboardQuery = useQuery({
        queryKey: ["dashboard"],
        queryFn: async () => {
            const response = await getDashboard();
            return response.data.data;
        },
    });

    const budgetQuery = useQuery({
        queryKey: ["dashboard", "budget-overview"],
        queryFn: async () => {
            const [budgetsResponse, monthResponse] = await Promise.all([
                getBudgets(),
                getCurrentMonthBudgetData(),
            ]);

            return {
                budgets: budgetsResponse.data.data,
                monthExpenses: monthResponse.data.data.expenses,
            };
        },
    });

    return {
        dashboardQuery,
        budgetQuery,
        isLoading: dashboardQuery.isLoading || budgetQuery.isLoading,
        isError: dashboardQuery.isError || budgetQuery.isError,
        error: dashboardQuery.error || budgetQuery.error,
        refetch: () => {
            dashboardQuery.refetch();
            budgetQuery.refetch();
        },
    };
}

export default useDashboard;
