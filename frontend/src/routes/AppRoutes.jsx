import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Login from "../pages/Login";
import Register from "../pages/Register";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>

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