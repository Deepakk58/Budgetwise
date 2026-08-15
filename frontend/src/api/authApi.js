import api from "./axios";
import { API_ROUTES } from "../constants/apiRoutes";

export const loginUser = (data) =>
    api.post(API_ROUTES.AUTH.LOGIN, data);

export const registerUser = (data) =>
    api.post(API_ROUTES.AUTH.REGISTER, data);

export const logoutUser = () =>
    api.post(API_ROUTES.AUTH.LOGOUT);

export const getCurrentUser = () =>
    api.get(API_ROUTES.AUTH.CURRENT_USER);

export const refreshToken = () =>
    api.post(API_ROUTES.AUTH.REFRESH_TOKEN);

export const changePassword = (data) =>
    api.post(API_ROUTES.AUTH.CHANGE_PASSWORD, data);