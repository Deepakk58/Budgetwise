import api from "./axios";
import { API_ROUTES } from "../constants/apiRoutes";

export const getDashboard = () =>
    api.get(API_ROUTES.DASHBOARD.ROOT);

export const getChartData = () =>
    api.get(API_ROUTES.DASHBOARD.CHARTS);
