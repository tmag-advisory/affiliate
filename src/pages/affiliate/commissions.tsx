import { useCommissions } from "../../api/hooks";
import AffiliateHeader from "../../components/affiliate/AffiliateHeader";
import { cn } from "../../lib/utils";
import { AFFILIATE_GLASS_SURFACE } from "../../lib/chrome";
import { LucideCoins, LucideLoader2, LucideCalendar } from "lucide-react";
import { useMemo, useState } from "react";

const statusColors: Record<string, string> = {
    pending: "text-warning bg-warning-light",
    approved: "text-success bg-success-light",
    paid: "text-accent bg-accent/10",
    cancelled: "text-muted bg-button-secondary",
};

const statusOptions = ["all", "pending", "approved", "paid", "cancelled"];

function formatCurrency(amount: number, currency: string): string {
    const symbol = currency === "NGN" ? "₦" : "$";
    return `${symbol}${amount.toFixed(2)}`;
}

type Period = "all" | "7d" | "30d" | "90d" | "1y";

const PERIOD_LABELS: Record<Period, string> = {
    all: "All time",
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "90d": "Last 90 days",
    "1y": "Last year",
};

function getPeriodDates(period: Period): { startDate?: string; endDate?: string } {
    if (period === "all") return {};
    const now = new Date();
    const start = new Date(now);
    const days = period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365;
    start.setDate(start.getDate() - days);
    return {
        startDate: start.toISOString().split("T")[0],
        endDate: now.toISOString().split("T")[0],
    };
}

const Commissions = () => {
    const [period, setPeriod] = useState<Period>("all");
    const periodDates = useMemo(() => getPeriodDates(period), [period]);
    const { data: commissions, isLoading } = useCommissions(periodDates.startDate, periodDates.endDate);
    const [filter, setFilter] = useState("all");

    const filtered =
        commissions?.filter((c) => filter === "all" || c.status === filter) ??
        [];

    const totals = commissions?.reduce(
        (acc, c) => {
            const amount = parseFloat(c.amount);
            const curr = c.currency ?? "USD";
            acc[curr] = acc[curr] ?? { paid: 0, pending: 0, approved: 0 };
            if (c.status === "paid") acc[curr].paid += amount;
            if (c.status === "pending") acc[curr].pending += amount;
            if (c.status === "approved") acc[curr].approved += amount;
            return acc;
        },
        {} as Record<string, { paid: number; pending: number; approved: number }>,
    );

    return (
        <div>
            <AffiliateHeader title="Commissions" />

            {/* Period selector */}
            <div className={cn(AFFILIATE_GLASS_SURFACE, "flex items-center gap-1 p-1 mb-6 w-fit")}>
                <LucideCalendar className="w-4 h-4 text-muted ml-2 mr-1" />
                {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
                    <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                            period === p
                                ? "bg-dark text-white shadow-sm"
                                : "text-muted hover:text-heading hover:bg-background-secondary",
                        )}
                    >
                        {PERIOD_LABELS[p]}
                    </button>
                ))}
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                    { label: "Paid", key: "paid" as const, color: "text-success" },
                    { label: "Approved", key: "approved" as const, color: "text-accent" },
                    { label: "Pending", key: "pending" as const, color: "text-warning" },
                ].map(({ label, key, color }) => {
                    const byCurrency = Object.entries(totals ?? {})
                        .filter(([, v]) => v[key] > 0)
                        .map(([curr, v]) => ({ currency: curr, amount: v[key] }));
                    return (
                        <div key={label} className={cn(AFFILIATE_GLASS_SURFACE, "p-5")}>
                            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                                {label}
                            </p>
                            {byCurrency.length > 0 ?
                                byCurrency.map(({ currency, amount }) => (
                                    <p key={currency} className={`text-2xl font-serif ${color}`}>
                                        {formatCurrency(amount, currency)}
                                    </p>
                                ))
                            :   <p className={`text-2xl font-serif ${color}`}>$0.00</p>}
                        </div>
                    );
                })}
            </div>

            {/* Filter tabs */}
            <div
                className={cn(
                    AFFILIATE_GLASS_SURFACE,
                    "flex gap-1 mb-6 p-1 w-fit",
                )}
            >
                {statusOptions.map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={cn(
                            "px-4 py-2 rounded-3xl text-sm font-medium transition-all duration-300 ease-out cursor-pointer capitalize",
                            filter === s ?
                                "bg-dark text-white shadow-sm"
                            :   "text-muted hover:text-heading hover:bg-background-secondary",
                        )}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Commissions table */}
            {isLoading ?
                <div className="flex items-center justify-center py-20">
                    <LucideLoader2 className="w-6 h-6 animate-spin text-muted" />
                </div>
            :   <div className={cn(AFFILIATE_GLASS_SURFACE, "overflow-hidden")}>
                    {filtered.length > 0 ?
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wider text-muted border-b border-border-light/50">
                                        <th className="px-6 py-3 font-semibold">
                                            Campaign
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 font-semibold hidden sm:table-cell">
                                            Rate
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 font-semibold text-right">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((c) => (
                                        <tr
                                            key={c.id}
                                            className="border-b border-border-light/30 last:border-0 hover:bg-background-secondary/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-heading font-medium">
                                                {c.campaign}
                                            </td>
                                            <td className="px-6 py-4 text-heading font-semibold">
                                                {formatCurrency(
                                                    parseFloat(c.amount),
                                                    c.currency,
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-muted hidden sm:table-cell">
                                                {c.rate}%
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={cn(
                                                        "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize",
                                                        statusColors[
                                                            c.status
                                                        ] ||
                                                            "text-muted bg-button-secondary",
                                                    )}
                                                >
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-muted text-right">
                                                {new Date(
                                                    c.created_at,
                                                ).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    :   <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="w-12 h-12 rounded-full bg-button-secondary flex items-center justify-center mb-3">
                                <LucideCoins className="w-6 h-6 text-muted" />
                            </div>
                            <p className="text-sm text-muted font-medium">
                                No commissions found
                            </p>
                            <p className="text-xs text-muted/70 mt-1">
                                Start sharing your referral links to earn
                                commissions
                            </p>
                        </div>
                    }
                </div>
            }
        </div>
    );
};

export default Commissions;
