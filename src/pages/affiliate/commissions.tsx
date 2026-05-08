import { useCommissions } from "../../api/hooks";
import AffiliateHeader from "../../components/affiliate/AffiliateHeader";
import { cn } from "../../lib/utils";
import { AFFILIATE_GLASS_SURFACE } from "../../lib/chrome";
import { LucideCoins, LucideLoader2 } from "lucide-react";
import { useState } from "react";

const statusColors: Record<string, string> = {
    pending: "text-warning bg-warning-light",
    approved: "text-success bg-success-light",
    paid: "text-accent bg-accent/10",
    cancelled: "text-muted bg-button-secondary",
};

const statusOptions = ["all", "pending", "approved", "paid", "cancelled"];

const Commissions = () => {
    const { data: commissions, isLoading } = useCommissions();
    const [filter, setFilter] = useState("all");

    const filtered =
        commissions?.filter((c) => filter === "all" || c.status === filter) ??
        [];

    const totals = commissions?.reduce(
        (acc, c) => {
            const amount = parseFloat(c.amount);
            if (c.status === "paid") acc.paid += amount;
            if (c.status === "pending") acc.pending += amount;
            if (c.status === "approved") acc.approved += amount;
            return acc;
        },
        { paid: 0, pending: 0, approved: 0 },
    );

    return (
        <div>
            <AffiliateHeader title="Commissions" />

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className={cn(AFFILIATE_GLASS_SURFACE, "p-5")}>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                        Paid
                    </p>
                    <p className="text-2xl font-serif text-success">
                        ${totals?.paid.toFixed(2) ?? "0.00"}
                    </p>
                </div>
                <div className={cn(AFFILIATE_GLASS_SURFACE, "p-5")}>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                        Approved
                    </p>
                    <p className="text-2xl font-serif text-accent">
                        ${totals?.approved.toFixed(2) ?? "0.00"}
                    </p>
                </div>
                <div className={cn(AFFILIATE_GLASS_SURFACE, "p-5")}>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                        Pending
                    </p>
                    <p className="text-2xl font-serif text-warning">
                        ${totals?.pending.toFixed(2) ?? "0.00"}
                    </p>
                </div>
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
                                                $
                                                {parseFloat(c.amount).toFixed(
                                                    2,
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
