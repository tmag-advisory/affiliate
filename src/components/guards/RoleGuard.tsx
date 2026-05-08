import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { canAccessAffiliate } from "../../lib/canAccessAffiliate";
import type { ReactNode } from "react";

interface RoleGuardProps {
    children: ReactNode;
    redirectTo?: string;
}

const RoleGuard = ({ children, redirectTo }: RoleGuardProps) => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    if (!canAccessAffiliate(user)) {
        return <Navigate to={redirectTo ?? "/login"} replace />;
    }

    return <>{children}</>;
};

export default RoleGuard;
