export const API_ROUTES = {
    AUTH: {
        LOGIN: "/users/login",
        REGISTER: "/users/register",
        LOGOUT: "/users/logout",
        CURRENT_USER: "/users/current-user",
        REFRESH_TOKEN: "/users/refresh-token",
        CHANGE_PASSWORD: "/users/change-password",
    },
    DASHBOARD: {
        ROOT: "/dashboard",
        CHARTS: "/dashboard/charts",
    },
    BUDGETS: {
        ROOT: "/budgets",
        MULTIPLE: "/budgets/multiple",
        CURRENT_MONTH: "/budgets/current-month",
        CATEGORIES: "/budgets/categories",
    },
    EXPENSES: {
        ROOT: "/expenses",
    },
    INCOMES: {
        ROOT: "/incomes",
    },
    GROUPS: {
        ROOT: "/groups",
        JOIN: "/groups/join",
    },
    GROUP_EXPENSES: {
        ROOT: "/group-expenses",
    },
    SETTLEMENTS: {
        ROOT: "/settlements",
    },
};
