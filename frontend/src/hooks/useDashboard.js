import { useQuery } from "@tanstack/react-query";

import { getDashboard, getChartData } from "../api/dashboardApi";
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

    const chartsQuery = useQuery({
        queryKey: ["dashboard", "charts"],
        queryFn: async () => {
            const response = await getChartData();
            return response.data.data;
        },
    });

    return {
        dashboardQuery,
        budgetQuery,
        chartsQuery,
        isLoading: dashboardQuery.isLoading || budgetQuery.isLoading,
        isError: dashboardQuery.isError || budgetQuery.isError,
        error: dashboardQuery.error || budgetQuery.error,
        refetch: () => {
            dashboardQuery.refetch();
            budgetQuery.refetch();
            chartsQuery.refetch();
        },
    };
}

export default useDashboard;
