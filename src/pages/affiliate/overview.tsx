import { useAuth } from "../../context/AuthContext";
import { useAffiliateProfile, useAffiliateStats } from "../../api/hooks";
import AffiliateHeader from "../../components/affiliate/AffiliateHeader";
import StatCard from "../../components/affiliate/StatCard";
import {
    LucideMousePointerClick,
    LucideUsers,
    LucideCoins,
    LucideWallet,
    LucideArrowRight,
    LucideLoader2,
    LucideTrendingUp,
    LucideClock,
    LucidePauseCircle,
} from "lucide-react";
import { AFFILIATE_GLASS_SURFACE } from "../../lib/chrome";
import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";

const statusColors: Record<string, string> = {
    pending: "text-warning bg-warning-light",
    approved: "text-success bg-success-light",
    paid: "text-accent bg-accent/10",
    cancelled: "text-muted bg-button-secondary",
};

const Overview = () => {
    const { user } = useAuth();
    const { data: profile } = useAffiliateProfile();
    const { data: stats, isLoading } = useAffiliateStats();

    if (profile?.status === "pending") {
        return (
            <div>
                <AffiliateHeader title={`Welcome, ${user?.first_name ?? "Affiliate"}.`} />
                <div className={cn(AFFILIATE_GLASS_SURFACE, "p-8 flex flex-col items-center text-center max-w-lg mx-auto mt-8")}>
                    <div className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center mb-4">
                        <LucideClock className="w-8 h-8 text-warning" />
                    </div>
                    <h2 className="text-xl font-semibold text-heading mb-2">Application under review</h2>
                    <p className="text-sm text-muted leading-relaxed">
                        Your affiliate application is pending approval. Our team reviews applications within 2–3 business days.
                        You'll receive an email once a decision is made.
                    </p>
                </div>
            </div>
        );
    }

    if (profile?.status === "suspended") {
        return (
            <div>
                <AffiliateHeader title={`Welcome back, ${user?.first_name ?? "Affiliate"}.`} />
                <div className={cn(AFFILIATE_GLASS_SURFACE, "p-8 flex flex-col items-center text-center max-w-lg mx-auto mt-8")}>
                    <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center mb-4">
                        <LucidePauseCircle className="w-8 h-8 text-danger" />
                    </div>
                    <h2 className="text-xl font-semibold text-heading mb-2">Account suspended</h2>
                    <p className="text-sm text-muted leading-relaxed">
                        Your affiliate account has been suspended. Please contact support for more information.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <AffiliateHeader
                title={`Welcome back, ${user?.first_name ?? "Affiliate"}.`}
            />

            {/* Stats grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <LucideLoader2 className="w-6 h-6 animate-spin text-muted" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard
                            label="Total clicks"
                            value={stats?.clicks ?? 0}
                            icon={<LucideMousePointerClick className="w-4 h-4" />}
                        />
                        <StatCard
                            label="Conversions"
                            value={stats?.conversions ?? 0}
                            icon={<LucideUsers className="w-4 h-4" />}
                            accent
                        />
                        <StatCard
                            label="Commission earned"
                            value={`$${parseFloat(stats?.total_commission ?? "0").toLocaleString()}`}
                            icon={<LucideCoins className="w-4 h-4" />}
                        />
                        <StatCard
                            label="Pending payout"
                            value={`$${parseFloat(stats?.pending_commission ?? "0").toLocaleString()}`}
                            icon={<LucideWallet className="w-4 h-4" />}
                        />
                    </div>

                    {/* Quick actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <Link
                            to="/links"
                            className={cn(AFFILIATE_GLASS_SURFACE, "p-5 flex items-center justify-between hover:bg-background-secondary/30 transition-colors")}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-affiliate/10 flex items-center justify-center">
                                    <LucideTrendingUp className="w-5 h-5 text-affiliate" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-heading">Create referral link</p>
                                    <p className="text-xs text-muted">Start tracking conversions</p>
                                </div>
                            </div>
                            <LucideArrowRight className="w-4 h-4 text-muted" />
                        </Link>
                        <Link
                            to="/payouts"
                            className={cn(AFFILIATE_GLASS_SURFACE, "p-5 flex items-center justify-between hover:bg-background-secondary/30 transition-colors")}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                    <LucideWallet className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-heading">Request payout</p>
                                    <p className="text-xs text-muted">Withdraw your earnings</p>
                                </div>
                            </div>
                            <LucideArrowRight className="w-4 h-4 text-muted" />
                        </Link>
                    </div>

                    {/* Campaign performance */}
                    <div className={cn(AFFILIATE_GLASS_SURFACE, "overflow-hidden mb-8")}>
                        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border-light/50">
                            <h2 className="text-base font-semibold text-heading">Top campaigns</h2>
                            <Link
                                to="/links"
                                className="text-xs text-accent font-medium hover:underline flex items-center gap-1"
                            >
                                View all <LucideArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wider text-muted border-b border-border-light/50">
                                        <th className="px-6 py-3 font-semibold">Campaign</th>
                                        <th className="px-6 py-3 font-semibold">Clicks</th>
                                        <th className="px-6 py-3 font-semibold">Conversions</th>
                                        <th className="px-6 py-3 font-semibold text-right">Commission</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(stats?.top_campaigns ?? []).length > 0 ? (
                                        stats?.top_campaigns.map((campaign) => (
                                            <tr
                                                key={campaign.campaign}
                                                className="border-b border-border-light/30 last:border-0 hover:bg-background-secondary/50 transition-colors"
                                            >
                                                <td className="px-6 py-4 text-heading font-medium">{campaign.campaign}</td>
                                                <td className="px-6 py-4 text-muted">{campaign.clicks}</td>
                                                <td className="px-6 py-4 text-muted">{campaign.conversions}</td>
                                                <td className="px-6 py-4 text-heading font-semibold text-right">
                                                    ${parseFloat(campaign.commission).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="py-12 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-12 h-12 rounded-full bg-button-secondary flex items-center justify-center mb-3 mx-auto">
                                                        <LucideTrendingUp className="w-6 h-6 text-muted" />
                                                    </div>
                                                    <p className="text-sm text-muted">No campaigns yet</p>
                                                    <p className="text-xs text-muted/70 mt-1">
                                                        Create your first referral link to track campaigns
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent commissions */}
                    <div className={cn(AFFILIATE_GLASS_SURFACE, "overflow-hidden")}>
                        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border-light/50">
                            <h2 className="text-base font-semibold text-heading">Recent commissions</h2>
                            <Link
                                to="/commissions"
                                className="text-xs text-accent font-medium hover:underline flex items-center gap-1"
                            >
                                View all <LucideArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wider text-muted border-b border-border-light/50">
                                        <th className="px-6 py-3 font-semibold">Campaign</th>
                                        <th className="px-6 py-3 font-semibold">Amount</th>
                                        <th className="px-6 py-3 font-semibold">Status</th>
                                        <th className="px-6 py-3 font-semibold">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(stats?.recent_commissions ?? []).length > 0 ? (
                                        stats?.recent_commissions.map((c) => (
                                            <tr
                                                key={c.id}
                                                className="border-b border-border-light/30 last:border-0 hover:bg-background-secondary/50 transition-colors"
                                            >
                                                <td className="px-6 py-4 text-heading font-medium">{c.campaign}</td>
                                                <td className="px-6 py-4 text-heading font-semibold">
                                                    ${parseFloat(c.amount).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={cn(
                                                            "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize",
                                                            statusColors[c.status] || "text-muted bg-button-secondary",
                                                        )}
                                                    >
                                                        {c.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-muted">
                                                    {new Date(c.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="py-12 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-12 h-12 rounded-full bg-button-secondary flex items-center justify-center mb-3 mx-auto">
                                                        <LucideCoins className="w-6 h-6 text-muted" />
                                                    </div>
                                                    <p className="text-sm text-muted">No commissions yet</p>
                                                    <p className="text-xs text-muted/70 mt-1">
                                                        Share your referral links to start earning commissions
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Overview;
