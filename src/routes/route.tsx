import { lazy, Suspense, type ReactNode } from "react";
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

const loadingFallback = (
    <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-darkest flex items-center justify-center">
                <span className="text-white font-bold">TM</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
        </div>
    </div>
);

const withSuspense = (element: ReactNode) => (
    <Suspense fallback={loadingFallback}>{element}</Suspense>
);

const router = createBrowserRouter([
    // Auth routes
    {
        element: <AuthLayout />,
        children: [
            { path: "login", element: withSuspense(<Login />) },
            { path: "register", element: withSuspense(<Register />) },
            { path: "forgot-password", element: withSuspense(<ForgotPassword />) },
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
            { index: true, element: withSuspense(<Overview />) },
            { path: "links", element: withSuspense(<Links />) },
            { path: "commissions", element: withSuspense(<Commissions />) },
            { path: "payouts", element: withSuspense(<Payouts />) },
            { path: "resources", element: withSuspense(<Resources />) },
            { path: "settings", element: withSuspense(<Settings />) },
        ],
    },

    // 404
    { path: "*", element: withSuspense(<NotFound />) },
]);

export default router;
