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
    },
    BUDGETS: {
        ROOT: "/budgets",
        CURRENT_MONTH: "/budgets/current-month",
        CATEGORIES: "/budgets/categories",
    },
    EXPENSES: {
        ROOT: "/expenses",
        RECENT: "/expenses/recent",
        TOTAL: "/expenses/total",
        CHARTS: "/expenses/charts",
    },
    INCOMES: {
        ROOT: "/incomes",
        RECENT: "/incomes/recent",
        TOTAL: "/incomes/total",
        MONTHLY: "/incomes/monthly",
    },
};
