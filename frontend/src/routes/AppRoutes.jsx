import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>

            <Route
                path="/"
                element={<Navigate to="/home" replace />}
            />

            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Dashboard />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/login"
                element={
                    <MainLayout>
                        <Login />
                    </MainLayout>
                }
            />

            <Route
                path="/register"
                element={
                    <MainLayout>
                        <Register />
                    </MainLayout>
                }
            />

        </Routes>
    );
}

export default AppRoutes;
