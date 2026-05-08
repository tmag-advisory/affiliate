import { useState } from "react";
import { usePayouts, useRequestPayout, useAffiliateProfile } from "../../api/hooks";
import AffiliateHeader from "../../components/affiliate/AffiliateHeader";
import Button from "../../components/ui/Button";
import { cn } from "../../lib/utils";
import { AFFILIATE_GLASS_SURFACE } from "../../lib/chrome";
import {
    LucideWallet,
    LucideLoader2,
    LucideBanknote,
    LucideX,
} from "lucide-react";
import toast from "react-hot-toast";

const payoutStatusColors: Record<string, string> = {
    pending: "text-warning bg-warning-light",
    processing: "text-accent bg-accent/10",
    completed: "text-success bg-success-light",
    failed: "text-danger bg-danger-light",
};

const Payouts = () => {
    const { data: payouts, isLoading } = usePayouts();
    const { data: profile } = useAffiliateProfile();
    const requestPayout = useRequestPayout();

    const [showForm, setShowForm] = useState(false);
    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
    const [paymentDetails, setPaymentDetails] = useState("");

    const pendingCommission = parseFloat(profile?.pending_commission ?? "0");

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (!numAmount || numAmount <= 0) {
            toast.error("Please enter a valid amount.");
            return;
        }
        if (numAmount > pendingCommission) {
            toast.error(`You only have $${pendingCommission.toFixed(2)} available.`);
            return;
        }
        try {
            await requestPayout.mutateAsync({
                amount: numAmount,
                payment_method: paymentMethod,
                payment_details: paymentDetails,
            });
            toast.success("Payout requested!");
            setAmount("");
            setPaymentDetails("");
            setShowForm(false);
        } catch {
            toast.error("Failed to request payout. Please try again.");
        }
    };

    return (
        <div>
            <AffiliateHeader title="Payouts" />

            {/* Available balance */}
            <div className={cn(AFFILIATE_GLASS_SURFACE, "p-6 mb-8")}>
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xs uppercase tracking-wider text-muted font-semibold">
                            Available for payout
                        </span>
                        <p className="text-3xl font-serif text-heading mt-2">
                            ${pendingCommission.toFixed(2)}
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowForm(true)}
                        disabled={pendingCommission <= 0}
                    >
                        <LucideBanknote className="w-4 h-4" />
                        Request payout
                    </Button>
                </div>
            </div>

            {/* Request form */}
            {showForm && (
                <form
                    onSubmit={handleRequest}
                    className={cn(AFFILIATE_GLASS_SURFACE, "p-6 mb-8 space-y-4")}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-heading">Request payout</h3>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="p-1 hover:bg-button-secondary rounded-lg transition-colors"
                        >
                            <LucideX className="w-5 h-5 text-muted" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                Amount ($)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="1"
                                max={pendingCommission}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full px-4 py-2.5 rounded-xl border border-border-light/60 bg-white text-sm text-heading placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                Payment method
                            </label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-border-light/60 bg-white text-sm text-heading focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                            >
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="paypal">PayPal</option>
                                <option value="mobile_money">Mobile Money</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                Account details
                            </label>
                            <input
                                value={paymentDetails}
                                onChange={(e) => setPaymentDetails(e.target.value)}
                                placeholder="Account number / email"
                                className="w-full px-4 py-2.5 rounded-xl border border-border-light/60 bg-white text-sm text-heading placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pt-2 border-t border-border-light/30">
                        <Button type="submit" loading={requestPayout.isPending} size="sm">
                            Submit request
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowForm(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            )}

            {/* Payout history */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <LucideLoader2 className="w-6 h-6 animate-spin text-muted" />
                </div>
            ) : (
                <div className={cn(AFFILIATE_GLASS_SURFACE, "overflow-hidden")}>
                    {payouts && payouts.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wider text-muted border-b border-border-light/50">
                                        <th className="px-6 py-3 font-semibold">Amount</th>
                                        <th className="px-6 py-3 font-semibold hidden sm:table-cell">Method</th>
                                        <th className="px-6 py-3 font-semibold">Status</th>
                                        <th className="px-6 py-3 font-semibold hidden md:table-cell">Requested</th>
                                        <th className="px-6 py-3 font-semibold text-right">Processed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payouts.map((p) => (
                                        <tr
                                            key={p.id}
                                            className="border-b border-border-light/30 last:border-0 hover:bg-background-secondary/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-heading font-semibold">
                                                ${parseFloat(p.amount).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-muted capitalize hidden sm:table-cell">
                                                {p.payment_method.replace("_", " ")}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={cn(
                                                        "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize",
                                                        payoutStatusColors[p.status] || "text-muted bg-button-secondary",
                                                    )}
                                                >
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-muted hidden md:table-cell">
                                                {new Date(p.requested_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-muted text-right">
                                                {p.processed_at
                                                    ? new Date(p.processed_at).toLocaleDateString()
                                                    : "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="w-12 h-12 rounded-full bg-button-secondary flex items-center justify-center mb-3">
                                <LucideWallet className="w-6 h-6 text-muted" />
                            </div>
                            <p className="text-sm text-muted font-medium">No payouts yet</p>
                            <p className="text-xs text-muted/70 mt-1">
                                Request your first payout once you have earned commissions
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Payouts;
