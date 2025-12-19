import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/global.css';
import './bootstrap';

// Pages
import LoginPage from './Pages/LoginPage';
import AppNavbar from './Pages/AppNavbar';
import Footer from './Pages/Footer';
import HomePage from './Pages/HomePage';
import AboutPage from './Pages/AboutPage';

// NEWS
import NewsPageIndex from './Pages/NewsPage/Index';
import NewsPageCreate from './Pages/NewsPage/Create';
import NewsPageEdit from './Pages/NewsPage/Edit';
import NewsPageShow from './Pages/NewsPage/Show';

// USER MANAGEMENT (Super Admin Only)
import UserIndexPage from './Pages/UserPage/Index';
import UserCreatePage from './Pages/UserPage/Create';
import UserEditPage from './Pages/UserPage/Edit';
import UserShowPage from './Pages/UserPage/Show';

const AppWrapper = () => {
    const location = useLocation();

    /* -------------------------------------------------------
       🔥 SOLUTION 1 — AUTO LOGOUT ON SYSTEM START (ONLY ONCE)
       Ensures login page always appears when running system
    -------------------------------------------------------- */
    useEffect(() => {
        if (!sessionStorage.getItem("alreadyLoaded")) {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user_role");
            sessionStorage.setItem("alreadyLoaded", "yes");
        }
    }, []);

    const authToken = localStorage.getItem("auth_token");
    const userRole = localStorage.getItem("user_role");

    const isAuthenticated = !!authToken;
    const isMember = userRole === "member" || userRole === "user";

    /* ------------------------------------
       PROTECTED ROUTE SYSTEM
    ------------------------------------ */
    const ProtectedRoute = ({ allowedRoles, children }) => {
        const role = localStorage.getItem("user_role");

        // Member is NOT allowed to use ANY protected routes
        if (role === "member" || role === "user") {
            return <Navigate to="/" replace />;
        }

        // Route requires login but user is not logged in
        if (!isAuthenticated) {
            return <Navigate to="/login" replace />;
        }

        // Logged in but not authorized for this route
        if (allowedRoles && !allowedRoles.includes(role)) {
            return <Navigate to="/" replace />;
        }

        return children;
    };

    const isLoginPage = location.pathname === "/login";

    return (
        <div className="app-container">

            {/* NAVBAR: visible to EVERYONE except login */}
            {!isLoginPage && <AppNavbar userRole={userRole} />}

            <main>
                <Routes>

                    {/* LOGIN — ONLY FOR ADMIN + SUPER ADMIN */}
                    <Route
                        path="/login"
                        element={
                            isAuthenticated && !isMember
                                ? <Navigate to="/" replace />
                                : <LoginPage />
                        }
                    />

                    {/* PUBLIC PAGES — VIEWABLE BY ALL ROLES (INCLUDING MEMBER) */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/news" element={<NewsPageIndex />} />
                    <Route path="/news/view/:postId" element={<NewsPageShow />} />

                    {/* ADMIN + SUPER ADMIN — MANAGE NEWS */}
                    <Route
                        path="/news/create"
                        element={
                            <ProtectedRoute allowedRoles={["admin", "super admin"]}>
                                <NewsPageCreate />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/news/edit/:postId"
                        element={
                            <ProtectedRoute allowedRoles={["admin", "super admin"]}>
                                <NewsPageEdit />
                            </ProtectedRoute>
                        }
                    />

                    {/* SUPER ADMIN ONLY — USER MANAGEMENT */}
                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute allowedRoles={["super admin"]}>
                                <UserIndexPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/users/create"
                        element={
                            <ProtectedRoute allowedRoles={["super admin"]}>
                                <UserCreatePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/users/edit/:userId"
                        element={
                            <ProtectedRoute allowedRoles={["super admin"]}>
                                <UserEditPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/users/view/:userId"
                        element={
                            <ProtectedRoute allowedRoles={["super admin"]}>
                                <UserShowPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* FALLBACK */}
                    <Route path="*" element={<Navigate to="/" replace />} />

                </Routes>
            </main>

            {!isLoginPage && <Footer />}
        </div>
    );
};

const App = () => (
    <BrowserRouter>
        <AppWrapper />
    </BrowserRouter>
);

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}