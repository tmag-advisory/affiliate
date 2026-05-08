import type { AuthUser } from "../context/AuthContext";

const AFFILIATE_ALLOWED_ROLES = ["superadmin", "administrator", "admin", "affiliate"];

export function canAccessAffiliate(user: AuthUser | null): boolean {
    if (!user) return false;
    return AFFILIATE_ALLOWED_ROLES.includes(user.extend.role_name.toLowerCase());
}
