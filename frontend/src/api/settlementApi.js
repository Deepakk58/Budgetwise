import api from "./axios";
import { API_ROUTES } from "../constants/apiRoutes";

export const getSettlementSuggestions = (groupId) =>
    api.get(`${API_ROUTES.SETTLEMENTS.ROOT}/${groupId}/suggestions`);

export const getSettlementHistory = (groupId) =>
    api.get(`${API_ROUTES.SETTLEMENTS.ROOT}/${groupId}/history`);

export const recordSettlement = (groupId, data) =>
    api.post(`${API_ROUTES.SETTLEMENTS.ROOT}/${groupId}`, data);
