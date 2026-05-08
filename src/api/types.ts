// ─── Auth ────────────────────────────────────────────────────

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation?: string;
    account_type?: "AFFILIATE";
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
    password_confirmation: string;
}

export interface AuthUserResponse {
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
    extend: {
        role_id: number;
        role_name: string;
    };
    user_credit_plan?: CreditPlan | null;
    settings?: UserSettingResponse;
    consentValid?: boolean;
    type?: string | null;
}

export interface CreditPlan {
    id: number;
    code: string;
    displayName: string;
    basePriceUsd: number;
    basePriceNgn: number | null;
    description: string | null;
    isDefault: boolean;
    isCompanyPlan: boolean;
    isFamilyPlan: boolean;
    signupRangeLabel: string | null;
    serviceLevel: string | null;
    visibility?: string | null;
    assignedCompanyId?: number | null;
    planCount?: number | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserSettingResponse {
    id: number;
    email_notifications: boolean;
    sms_notifications: boolean;
    two_factor_enabled: boolean;
}

// ─── Affiliate ───────────────────────────────────────────────

export interface AffiliateProfile {
    id: number;
    user_id: number;
    referral_code: string;
    commission_rate: number;
    total_clicks: number;
    total_conversions: number;
    total_commission_earned: string;
    total_paid_out: string;
    pending_commission: string;
    total_commission_earned_ngn: string;
    total_paid_out_ngn: string;
    pending_commission_ngn: string;
    status: "active" | "suspended" | "pending";
    created_at: string;
    updated_at: string;
}

export interface ReferralLink {
    id: number;
    affiliate_id: number;
    campaign: string;
    destination_url: string;
    short_code: string;
    clicks: number;
    conversions: number;
    commission_earned: string;
    is_active: boolean;
    credit_plan_id?: number | null;
    credit_plan_code?: string | null;
    credit_plan_name?: string | null;
    created_at: string;
}

export interface CommissionRecord {
    id: number;
    affiliate_id: number;
    referral_link_id: number;
    campaign: string;
    amount: string;
    rate: number;
    status: "pending" | "approved" | "paid" | "cancelled";
    currency: string;
    customer_email?: string;
    reference_type: string;
    reference_id: number;
    created_at: string;
    paid_at?: string;
}

export interface PayoutRecord {
    id: number;
    affiliate_id: number;
    amount: string;
    currency: string;
    payment_method: string;
    payment_details: string;
    status: "pending" | "processing" | "completed" | "failed";
    notes?: string;
    requested_at: string;
    processed_at?: string;
}

export interface AffiliateStats {
    clicks: number;
    conversions: number;
    conversion_rate: number;
    total_commission: string;
    pending_commission: string;
    paid_commission: string;
    total_commission_ngn: string;
    pending_commission_ngn: string;
    paid_commission_ngn: string;
    active_links: number;
    top_campaigns: Array<{
        campaign: string;
        clicks: number;
        conversions: number;
        commission: string;
    }>;
    recent_commissions: CommissionRecord[];
    clicks_chart: Array<{
        date: string;
        clicks: number;
        conversions: number;
    }>;
}

// ─── API Response wrappers ───────────────────────────────────

export interface SuccessResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T;
}

export interface PaginatedResponse<T> extends SuccessResponse<T[]> {
    pagination: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
}
