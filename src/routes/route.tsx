import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/authLayout";
import AffiliateLayout from "../layouts/affiliateLayout";
import ProtectedRoute from "../components/guards/ProtectedRoute";
import RoleGuard from "../components/guards/RoleGuard";

// Auth pages
const Login = lazy(() => import("../pages/auth/login"));
const Register = lazy(() => import("../pages/auth/register"));
const ForgotPassword = lazy(() => import("../pages/auth/forgot-password"));

// Affiliate pages
const Overview = lazy(() => import("../pages/affiliate/overview"));
const Links = lazy(() => import("../pages/affiliate/links"));
const Commissions = lazy(() => import("../pages/affiliate/commissions"));
const Payouts = lazy(() => import("../pages/affiliate/payouts"));
const Resources = lazy(() => import("../pages/affiliate/resources"));
const Settings = lazy(() => import("../pages/affiliate/settings"));

// Error pages
const NotFound = lazy(() => import("../pages/not-found"));

const router = createBrowserRouter([
    // Auth routes
    {
        element: <AuthLayout />,
        children: [
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "forgot-password", element: <ForgotPassword /> },
        ],
    },

    // Redirect root to dashboard
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <RoleGuard>
                    <AffiliateLayout />
                </RoleGuard>
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Overview /> },
            { path: "links", element: <Links /> },
            { path: "commissions", element: <Commissions /> },
            { path: "payouts", element: <Payouts /> },
            { path: "resources", element: <Resources /> },
            { path: "settings", element: <Settings /> },
        ],
    },

    // 404
    { path: "*", element: <NotFound /> },
]);

export default router;
