import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./axios";
import type {
    AffiliateProfile,
    ReferralLink,
    CommissionRecord,
    PayoutRecord,
    AffiliateStats,
    CreditPlan,
    SuccessResponse,
} from "./types";

// ─── Query keys ──────────────────────────────────────────────

export const affiliateKeys = {
    all: ["affiliate"] as const,
    profile: () => [...affiliateKeys.all, "profile"] as const,
    links: () => [...affiliateKeys.all, "links"] as const,
    commissions: () => [...affiliateKeys.all, "commissions"] as const,
    payouts: () => [...affiliateKeys.all, "payouts"] as const,
    stats: () => [...affiliateKeys.all, "stats"] as const,
    creditPlans: () => [...affiliateKeys.all, "credit-plans"] as const,
};

// ─── Affiliate Profile ───────────────────────────────────────

export function useAffiliateProfile() {
    return useQuery({
        queryKey: affiliateKeys.profile(),
        queryFn: async () => {
            const res = await api.get<SuccessResponse<AffiliateProfile>>("/affiliate/profile");
            return res.data.data;
        },
    });
}

// ─── Referral Links ──────────────────────────────────────────

export function useReferralLinks() {
    return useQuery({
        queryKey: affiliateKeys.links(),
        queryFn: async () => {
            const res = await api.get<SuccessResponse<ReferralLink[]>>("/affiliate/links");
            return res.data.data;
        },
    });
}

export function useCreateReferralLink() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { campaign: string; destination_url?: string; credit_plan_id?: number }) => {
            const res = await api.post<SuccessResponse<ReferralLink>>("/affiliate/links", data);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: affiliateKeys.links() });
            queryClient.invalidateQueries({ queryKey: affiliateKeys.stats() });
        },
    });
}

export function useCreditPlans() {
    return useQuery({
        queryKey: affiliateKeys.creditPlans(),
        queryFn: async () => {
            const res = await api.get<SuccessResponse<CreditPlan[]>>("/user-credit-plans");
            return res.data.data.filter((plan) => !plan.isCompanyPlan && !plan.isFamilyPlan);
        },
        staleTime: 10 * 60 * 1000,
    });
}

// ─── Commissions ─────────────────────────────────────────────

export function useCommissions() {
    return useQuery({
        queryKey: affiliateKeys.commissions(),
        queryFn: async () => {
            const res = await api.get<SuccessResponse<CommissionRecord[]>>("/affiliate/commissions");
            return res.data.data;
        },
    });
}

// ─── Payouts ─────────────────────────────────────────────────

export function usePayouts() {
    return useQuery({
        queryKey: affiliateKeys.payouts(),
        queryFn: async () => {
            const res = await api.get<SuccessResponse<PayoutRecord[]>>("/affiliate/payouts");
            return res.data.data;
        },
    });
}

export function useRequestPayout() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { amount: number; payment_method: string; payment_details: string }) => {
            const res = await api.post<SuccessResponse<PayoutRecord>>("/affiliate/payouts", data);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: affiliateKeys.payouts() });
            queryClient.invalidateQueries({ queryKey: affiliateKeys.profile() });
        },
    });
}

// ─── Stats / Dashboard ───────────────────────────────────────

export function useAffiliateStats() {
    return useQuery({
        queryKey: affiliateKeys.stats(),
        queryFn: async () => {
            const res = await api.get<SuccessResponse<AffiliateStats>>("/affiliate/stats");
            return res.data.data;
        },
    });
}
