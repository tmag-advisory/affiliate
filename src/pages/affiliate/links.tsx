import { useMemo, useState } from "react";
import AffiliateHeader from "../../components/affiliate/AffiliateHeader";
import Button from "../../components/ui/Button";
import { useReferralLinks, useCreateReferralLink, useCreditPlans, useCommissions } from "../../api/hooks";
import { cn } from "../../lib/utils";
import { AFFILIATE_GLASS_SURFACE } from "../../lib/chrome";
import {
    LucideLink2,
    LucideCopy,
    LucidePlus,
    LucideLoader2,
    LucideExternalLink,
    LucideCheck,
    LucideBarChart3,
    LucideSearch,
    LucideX,
} from "lucide-react";
import toast from "react-hot-toast";
import type { CreditPlan } from "../../api/types";

type RedirectTarget = "plan" | "pricing" | "home" | "custom";

const buildPlanDestination = (plan: CreditPlan | undefined, clientBaseUrl: string): string => {
    const base = clientBaseUrl.replace(/\/$/, "");
    if (!plan) return `${base}/pricing`;
    if (plan.isCompanyPlan) return `${base}/company-onboarding?plan=${encodeURIComponent(plan.code)}`;
    if (plan.isFamilyPlan) return `${base}/family-checkout?plan=FAMILY_${plan.id}`;
    return `${base}/pricing?plan=${encodeURIComponent(plan.code)}`;
};

const formatCurrency = (amount: number, currency: string): string => {
    const symbol = currency === "NGN" ? "₦" : "$";
    return `${symbol}${amount.toFixed(2)}`;
};

const Links = () => {
    const { data: links, isLoading } = useReferralLinks();
    const { data: commissions, isLoading: isLoadingCommissions } = useCommissions();
    const { data: creditPlans } = useCreditPlans();
    const createLink = useCreateReferralLink();

    const [showForm, setShowForm] = useState(false);
    const [campaign, setCampaign] = useState("");
    const [destinationUrl, setDestinationUrl] = useState("");
    const [redirectTarget, setRedirectTarget] = useState<RedirectTarget>("plan");
    const [creditPlanId, setCreditPlanId] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const clientBaseUrl = import.meta.env.VITE_CLIENT_BASE_URL || "http://localhost:3000";
    const normalizedClientBaseUrl = clientBaseUrl.replace(/\/$/, "");
    const baseUrl = `${normalizedClientBaseUrl}/ref`;

    const filtered = links?.filter((link) =>
        link.campaign.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

    const earnedByLink = useMemo(() => {
        return (commissions ?? []).reduce(
            (acc, commission) => {
                if (commission.status === "cancelled") return acc;

                const linkId = commission.referral_link_id;
                if (!linkId) return acc;

                const currency = commission.currency ?? "USD";
                acc[linkId] = acc[linkId] ?? {};
                acc[linkId][currency] = (acc[linkId][currency] ?? 0) + parseFloat(commission.amount);
                return acc;
            },
            {} as Record<number, Record<string, number>>,
        );
    }, [commissions]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!campaign.trim()) {
            toast.error("Add a campaign name.");
            return;
        }
        if (redirectTarget === "plan" && !creditPlanId) {
            toast.error("Choose a credit plan or switch the destination to home/pricing.");
            return;
        }
        if (redirectTarget === "custom" && !destinationUrl.trim()) {
            toast.error("Add a custom destination URL.");
            return;
        }

        const selectedPlan = (creditPlans ?? []).find((plan) => String(plan.id) === creditPlanId);
        const resolvedDestinationUrl = (() => {
            if (redirectTarget === "home") return `${normalizedClientBaseUrl}/`;
            if (redirectTarget === "pricing") {
                return selectedPlan ?
                    `${normalizedClientBaseUrl}/pricing?plan=${encodeURIComponent(selectedPlan.code)}`
                    : `${normalizedClientBaseUrl}/pricing`;
            }
            if (redirectTarget === "custom") return destinationUrl.trim();
            return buildPlanDestination(selectedPlan, normalizedClientBaseUrl);
        })();

        try {
            await createLink.mutateAsync({
                campaign: campaign.trim(),
                destination_url: resolvedDestinationUrl,
                credit_plan_id: creditPlanId ? Number(creditPlanId) : undefined,
            });
            toast.success("Referral link created!");
            setCampaign("");
            setDestinationUrl("");
            setRedirectTarget("plan");
            setCreditPlanId("");
            setShowForm(false);
        } catch {
            toast.error("Failed to create link. Please try again.");
        }
    };

    const copyToClipboard = (code: string, id: string) => {
        const fullUrl = `${baseUrl}/${code}`;
        navigator.clipboard.writeText(fullUrl).then(() => {
            setCopiedId(id);
            toast.success("Copied to clipboard!");
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    return (
        <div>
            <AffiliateHeader title="Referral Links" />

            {/* Create link form */}
            {showForm && (
                <form
                    onSubmit={handleCreate}
                    className={cn(AFFILIATE_GLASS_SURFACE, "p-6 mb-8 space-y-4")}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-heading">New referral link</h3>
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setCampaign("");
                                setDestinationUrl("");
                                setRedirectTarget("plan");
                                setCreditPlanId("");
                            }}
                            className="p-1 hover:bg-button-secondary rounded-lg transition-colors"
                        >
                            <LucideX className="w-5 h-5 text-muted" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                Campaign name
                            </label>
                            <input
                                value={campaign}
                                onChange={(e) => setCampaign(e.target.value)}
                                placeholder="e.g., Summer 2026 Blog"
                                className="w-full px-4 py-2.5 rounded-xl border border-border-light/60 bg-white text-sm text-heading placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                Credit plan
                            </label>
                            <select
                                value={creditPlanId}
                                onChange={(e) => setCreditPlanId(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-border-light/60 bg-white text-sm text-heading focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                            >
                                <option value="">No plan selected</option>
                                {(creditPlans ?? []).map((plan) => (
                                    <option key={plan.id} value={plan.id}>
                                        {plan.displayName} ({plan.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                Send visitors to
                            </label>
                            <select
                                value={redirectTarget}
                                onChange={(e) => setRedirectTarget(e.target.value as RedirectTarget)}
                                className="w-full px-4 py-2.5 rounded-xl border border-border-light/60 bg-white text-sm text-heading focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                            >
                                <option value="plan">Selected plan checkout</option>
                                <option value="pricing">Pricing page</option>
                                <option value="home">Home page</option>
                                <option value="custom">Custom URL</option>
                            </select>
                        </div>
                        {redirectTarget === "custom" && (
                            <div>
                                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                    Destination URL
                                </label>
                                <input
                                    value={destinationUrl}
                                    onChange={(e) => setDestinationUrl(e.target.value)}
                                    placeholder="https://example.com/page"
                                    className="w-full px-4 py-2.5 rounded-xl border border-border-light/60 bg-white text-sm text-heading placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3 pt-2 border-t border-border-light/30">
                        <Button type="submit" loading={createLink.isPending} size="sm">
                            <LucideLink2 className="w-4 h-4" />
                            Generate link
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setShowForm(false);
                                setCampaign("");
                                setDestinationUrl("");
                                setRedirectTarget("plan");
                                setCreditPlanId("");
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            )}

            {/* Search and create button */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <LucideSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search campaigns…"
                        className="w-full border border-border-light/55 bg-white/80 backdrop-blur-md rounded-xl pl-10 pr-4 py-2.5 text-sm text-heading placeholder:text-border outline-none focus:border-accent transition-colors duration-200 shadow-sm"
                    />
                </div>
                {!showForm && (
                    <Button onClick={() => setShowForm(true)}>
                        <LucidePlus className="w-4 h-4" />
                        Create link
                    </Button>
                )}
            </div>

            {/* Links table */}
            {isLoading || isLoadingCommissions ? (
                <div className="flex items-center justify-center py-20">
                    <LucideLoader2 className="w-6 h-6 animate-spin text-muted" />
                </div>
            ) : (
                <div className={cn(AFFILIATE_GLASS_SURFACE, "overflow-hidden")}>
                    {filtered.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wider text-muted border-b border-border-light/50">
                                        <th className="px-6 py-3 font-semibold">Campaign</th>
                                        <th className="px-6 py-3 font-semibold hidden sm:table-cell">Short link</th>
                                        <th className="px-6 py-3 font-semibold text-center">Clicks</th>
                                        <th className="px-6 py-3 font-semibold text-center">Conversions</th>
                                        <th className="px-6 py-3 font-semibold text-right">Earned</th>
                                        <th className="px-6 py-3 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((link) => (
                                        <tr
                                            key={link.id}
                                            className="border-b border-border-light/30 last:border-0 hover:bg-background-secondary/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-heading font-medium">
                                                {link.campaign}
                                            </td>
                                            <td className="px-6 py-4 hidden sm:table-cell">
                                                <code className="text-xs bg-button-secondary px-2 py-1 rounded-lg text-heading">
                                                    {baseUrl}/{link.short_code}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4 text-center text-muted">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <LucideBarChart3 className="w-3.5 h-3.5" />
                                                    {link.clicks}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-muted">{link.conversions}</td>
                                            <td className="px-6 py-4 text-right text-heading font-semibold">
                                                {Object.entries(earnedByLink[link.id] ?? {}).length > 0 ? (
                                                    <div className="space-y-1">
                                                        {Object.entries(earnedByLink[link.id])
                                                            .sort(([a], [b]) => a.localeCompare(b))
                                                            .map(([currency, amount]) => (
                                                                <div key={currency}>
                                                                    {formatCurrency(amount, currency)}
                                                                </div>
                                                            ))}
                                                    </div>
                                                ) : (
                                                    formatCurrency(0, "USD")
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => copyToClipboard(link.short_code, String(link.id))}
                                                        className="p-1.5 rounded-lg hover:bg-button-secondary transition-colors cursor-pointer"
                                                        title="Copy to clipboard"
                                                    >
                                                        {copiedId === String(link.id) ? (
                                                            <LucideCheck className="w-4 h-4 text-success" />
                                                        ) : (
                                                            <LucideCopy className="w-4 h-4 text-muted hover:text-heading" />
                                                        )}
                                                    </button>
                                                    <a
                                                        href={`${baseUrl}/${link.short_code}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1.5 rounded-lg hover:bg-button-secondary transition-colors"
                                                        title="Open link"
                                                    >
                                                        <LucideExternalLink className="w-4 h-4 text-muted hover:text-heading" />
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="w-12 h-12 rounded-full bg-button-secondary flex items-center justify-center mb-3">
                                <LucideLink2 className="w-6 h-6 text-muted" />
                            </div>
                            <p className="text-sm text-muted font-medium mb-1">
                                {search ? "No links found" : "No referral links yet"}
                            </p>
                            <p className="text-xs text-muted/70 mb-4">
                                {search
                                    ? "Try a different search term"
                                    : "Create your first link to start tracking referrals"}
                            </p>
                            {!showForm && !search && (
                                <Button onClick={() => setShowForm(true)} size="sm">
                                    <LucidePlus className="w-4 h-4" />
                                    Create link
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Links;
