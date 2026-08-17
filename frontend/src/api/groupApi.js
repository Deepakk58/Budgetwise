import api from "./axios";
import { API_ROUTES } from "../constants/apiRoutes";

export const getGroups = () =>
    api.get(API_ROUTES.GROUPS.ROOT);

export const createGroup = (data) =>
    api.post(API_ROUTES.GROUPS.ROOT, data);

export const getGroupDetails = (groupId) =>
    api.get(`${API_ROUTES.GROUPS.ROOT}/${groupId}`);

export const joinGroup = (token) =>
    api.post(`${API_ROUTES.GROUPS.JOIN}/${token}`);

export const refreshInvite = (groupId) =>
    api.post(`${API_ROUTES.GROUPS.ROOT}/${groupId}/refresh-invite`);
