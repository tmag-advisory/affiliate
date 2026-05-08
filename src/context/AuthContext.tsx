import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
    type ReactNode,
} from "react";
import type { LoginRequest, RegisterRequest } from "../api/types";
import api, { getAuthCookie, removeAuthCookie, setAuthCookie } from "../api/axios";
import { queryClient } from "../lib/queryclient";

// ─── Types ───────────────────────────────────────────────────

export interface AuthRole {
    role_id: number;
    role_name: string;
}

export interface AuthUser {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    phone: string;
    email: string;
    avatar_url: string;
    profile_picture_option?: string | null;
    last_login: string;
    onboarding_stage: number;
    is_verified: boolean;
    credits: number;
    billing_currency: string;
    extend: AuthRole;
    user_credit_plan?: import("../api/types").CreditPlan | null;
    settings?: import("../api/types").UserSettingResponse | null;
    consentValid?: boolean;
    type?: string | null;
}

interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginRequest) => Promise<AuthUser>;
    register: (data: Partial<RegisterRequest>) => Promise<AuthUser>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Revalidate session on mount / page reload via GET /profile
    const getCurrentProfile = useCallback(async () => {
        const token = getAuthCookie();
        if (!token) {
            setIsLoading(false);
            return;
        }
        try {
            const res = await api.get("/profile");
            const d = res.data.data as Record<string, unknown>;
            setUser(buildAuthUser(d));
        } catch {
            removeAuthCookie();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);

    const login = useCallback(async (data: LoginRequest): Promise<AuthUser> => {
        const res = await api.post("/auth/login", data);
        const d = res.data.data as Record<string, unknown>;
        const token = d.accessToken as string;
        const exp = d.exp as number;
        setAuthCookie(token, exp);

        const authUser = buildAuthUserFromLogin(d);
        setUser(authUser);
        return authUser;
    }, []);

    const register = useCallback(async (data: Partial<RegisterRequest>): Promise<AuthUser> => {
        const res = await api.post("/auth/register", data);
        const d = res.data.data as Record<string, unknown>;
        setAuthCookie(d.accessToken as string, d.exp as number);

        const authUser = buildAuthUserFromLogin(d);
        setUser(authUser);
        return authUser;
    }, []);

    const logout = useCallback(async () => {
        try {
            await api.post("/auth/logout");
        } catch {
            // swallow — we clear local state regardless
        }
        removeAuthCookie();
        setUser(null);
        queryClient.clear();
    }, []);

    const refreshProfile = useCallback(async () => {
        try {
            const res = await api.get("/profile");
            const d = res.data.data as Record<string, unknown>;
            setUser(buildAuthUser(d));
        } catch {
            // silent
        }
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            register,
            logout,
            refreshProfile,
        }),
        [user, isLoading, login, register, logout, refreshProfile],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}

// ─── Helpers ─────────────────────────────────────────────────

function extractRole(d: Record<string, unknown>): { role_id?: number; role_name?: string } {
    const directExtend = d.extend as { role_id?: number; role_name?: string } | undefined;
    if (directExtend?.role_name || directExtend?.role_id) {
        return directExtend;
    }

    const directRole = d.role as { role_id?: number; role_name?: string } | undefined;
    if (directRole?.role_name || directRole?.role_id) {
        return directRole;
    }

    const nestedUser = d.user as Record<string, unknown> | undefined;
    const nestedExtend = nestedUser?.extend as { role_id?: number; role_name?: string } | undefined;
    if (nestedExtend?.role_name || nestedExtend?.role_id) {
        return nestedExtend;
    }

    const nestedRole = nestedUser?.role as { role_id?: number; role_name?: string } | undefined;
    if (nestedRole?.role_name || nestedRole?.role_id) {
        return nestedRole;
    }

    return {};
}

function buildAuthUser(d: Record<string, unknown>): AuthUser {
    const extend = extractRole(d);
    const settings = d.settings as import("../api/types").UserSettingResponse | undefined;

    return {
        id: (d.id as number) ?? 0,
        first_name: (d.first_name as string) ?? "",
        last_name: (d.last_name as string) ?? "",
        username: (d.username as string) ?? "",
        phone: (d.phone as string) ?? "",
        email: (d.email as string) ?? "",
        avatar_url: (d.avatar_url as string) ?? "",
        profile_picture_option: (d.profile_picture_option as string | null) ?? null,
        last_login: (d.last_login as string) ?? "",
        onboarding_stage: (d.onboarding_stage as number) ?? 0,
        is_verified: (d.is_verified as boolean) ?? false,
        credits: (d.credits as number) ?? 0,
        billing_currency: (d.billing_currency as string) ?? "USD",
        extend: {
            role_id: extend?.role_id ?? 0,
            role_name: extend?.role_name ?? "",
        },
        user_credit_plan: (d.userCreditPlan ?? d.user_credit_plan) as import("../api/types").CreditPlan | null ?? null,
        settings: settings ?? null,
        consentValid: false,
        type: (d.type as string | null) ?? null,
    };
}

// Login/register responses include extend.role at top level
function buildAuthUserFromLogin(d: Record<string, unknown>): AuthUser {
    const extend = extractRole(d);
    const settings = d.settings as import("../api/types").UserSettingResponse | undefined;

    return {
        id: (d.id as number) ?? 0,
        first_name: (d.first_name as string) ?? "",
        last_name: (d.last_name as string) ?? "",
        username: (d.username as string) ?? "",
        phone: (d.phone as string) ?? "",
        email: (d.email as string) ?? "",
        avatar_url: (d.avatar_url as string) ?? "",
        profile_picture_option: (d.profile_picture_option as string | null) ?? null,
        last_login: (d.last_login as string) ?? "",
        onboarding_stage: (d.onboarding_stage as number) ?? 0,
        is_verified: (d.is_verified as boolean) ?? false,
        credits: (d.credits as number) ?? 0,
        billing_currency: (d.billing_currency as string) ?? "USD",
        extend: {
            role_id: extend?.role_id ?? 0,
            role_name: extend?.role_name ?? "",
        },
        user_credit_plan: (d.userCreditPlan ?? d.user_credit_plan) as import("../api/types").CreditPlan | null ?? null,
        settings: settings ?? null,
        consentValid: false,
        type: (d.type as string | null) ?? null,
    };
}
