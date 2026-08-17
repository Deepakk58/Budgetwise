import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Expenses from "../pages/Expenses";
import Income from "../pages/Income";
import Groups from "../pages/Groups";
import GroupDetails from "../pages/GroupDetails";
import ChangePassword from "../pages/ChangePassword";
import JoinGroup from "../pages/JoinGroup";
import NotFound from "../pages/NotFound";

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
                path="/expenses"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Expenses />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/income"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Income />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/groups"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Groups />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/groups/join/:token"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <JoinGroup />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/groups/:groupId"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <GroupDetails />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route 
                path="/change-password" 
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <ChangePassword />
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

            <Route
                path="*"
                element={
                    <MainLayout>
                        <NotFound />
                    </MainLayout>
                }
            />

        </Routes>
    );
}

export default AppRoutes;
