import { useState } from "react";
import { usePayouts, useRequestPayout, useAffiliateProfile, useBanks, useValidateBankAccount } from "../../api/hooks";
import AffiliateHeader from "../../components/affiliate/AffiliateHeader";
import Button from "../../components/ui/Button";
import { cn } from "../../lib/utils";
import { AFFILIATE_GLASS_SURFACE } from "../../lib/chrome";
import {
    LucideWallet,
    LucideLoader2,
    LucideBanknote,
    LucideX,
    LucideCheck,
    LucideAlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const payoutStatusColors: Record<string, string> = {
    pending: "text-warning bg-warning-light",
    processing: "text-accent bg-accent/10",
    completed: "text-success bg-success-light",
    failed: "text-danger bg-danger-light",
};

type PayoutCurrency = "USD" | "NGN";

const CURRENCY_SYMBOL: Record<PayoutCurrency, string> = {
    USD: "$",
    NGN: "\u20a6",
};

const BalanceRow = ({
    currency,
    balance,
    disabled,
    onRequest,
}: {
    currency: PayoutCurrency;
    balance: number;
    disabled: boolean;
    onRequest: () => void;
}) => (
    <div className="flex items-center justify-between">
        <div>
            <span className="text-[10px] uppercase tracking-widest text-muted font-semibold mb-0.5 block">
                {currency === "NGN" ? "Naira balance" : "Dollar balance"}
            </span>
            <p className="text-2xl font-serif text-heading">
                {CURRENCY_SYMBOL[currency]}
                {Number(balance.toFixed(2)).toLocaleString("us-US", {
                    minimumFractionDigits: 2,
                })}
            </p>
        </div>
        <Button
            onClick={onRequest}
            disabled={disabled || balance <= 0}
            size="sm"
            title={balance <= 0 ? "No balance in this currency" : undefined}
        >
            <LucideBanknote className="w-3.5 h-3.5" />
            Request
        </Button>
    </div>
);

const Payouts = () => {
    const { data: payouts, isLoading } = usePayouts();
    const { data: profile } = useAffiliateProfile();
    const requestPayout = useRequestPayout();

    const [showForm, setShowForm] = useState(false);
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState<PayoutCurrency>("USD");
    const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
    const [selectedBank, setSelectedBank] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [paymentDetails, setPaymentDetails] = useState("");

    const MIN_PAYOUT_USD = 200;
    const MIN_PAYOUT_NGN = 200000;
    const minPayout = currency === "NGN" ? MIN_PAYOUT_NGN : MIN_PAYOUT_USD;

    const balanceUsd = parseFloat(profile?.pending_commission ?? "0");
    const balanceNgn = parseFloat(profile?.pending_commission_ngn ?? "0");
    const activeBalance = currency === "NGN" ? balanceNgn : balanceUsd;
    const currencySymbol = CURRENCY_SYMBOL[currency];

    // For NGN, show Nigerian banks from Flutterwave
    const { data: banks } = useBanks(currency === "NGN" ? "NG" : "", currency === "NGN");
    const validateAccount = useValidateBankAccount();

    // Reset amount when currency changes to avoid stale values
    const handleCurrencyChange = (next: PayoutCurrency) => {
        setAmount("");
        setSelectedBank("");
        setAccountNumber("");
        setAccountName("");
        setPaymentDetails("");
        setPaymentMethod("bank_transfer");
        setCurrency(next);
        setShowForm(true);
    };

    const handleValidateAccount = () => {
        if (!selectedBank || accountNumber.length < 10) return;
        validateAccount.mutate(
            { accountNumber, bankCode: selectedBank },
            {
                onSuccess: (data) => {
                    if (data?.accountName) {
                        setAccountName(data.accountName);
                        setPaymentDetails(
                            `${data.accountName} | ${accountNumber} | ${selectedBank}`,
                        );
                    }
                },
            },
        );
    };



    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (!numAmount || numAmount <= 0) {
            toast.error("Please enter a valid amount.");
            return;
        }
        if (numAmount < minPayout) {
            toast.error(
                `Minimum payout is ${currencySymbol}${minPayout.toLocaleString()} for ${currency} payouts.`,
            );
            return;
        }
        if (numAmount > activeBalance) {
            toast.error(
                `You only have ${currencySymbol}${activeBalance.toFixed(2)} available in ${currency}.`,
            );
            return;
        }
        if (paymentMethod === "bank_transfer") {
            if (currency === "NGN" && (!selectedBank || !accountNumber || !accountName.trim())) {
                toast.error("Please select a bank, enter your account number, and provide the account name.");
                return;
            }
            if (currency === "USD" && !paymentDetails.trim()) {
                toast.error("Please enter your account details.");
                return;
            }
        }
        try {
            const details =
                currency === "NGN"
                    ? `${accountName} | ${accountNumber} | ${selectedBank}`
                    : paymentDetails;

            await requestPayout.mutateAsync({
                amount: numAmount,
                currency,
                payment_method: paymentMethod,
                payment_details: details,
            });
            toast.success("Payout requested!");
            resetForm();
            setShowForm(false);
        } catch {
            toast.error("Failed to request payout. Please try again.");
        }
    };

    const resetForm = () => {
        setAmount("");
        setCurrency("USD");
        setPaymentMethod("bank_transfer");
        setSelectedBank("");
        setAccountNumber("");
        setAccountName("");
        setPaymentDetails("");
    };

    return (
        <div>
            <AffiliateHeader title="Payouts" />

            {/* Available balances */}
            <div className={cn(AFFILIATE_GLASS_SURFACE, "p-6 mb-8 space-y-3")}>
                <span className="text-xs uppercase tracking-wider text-muted font-semibold">
                    Available for payout
                </span>
                <BalanceRow
                    currency="USD"
                    balance={balanceUsd}
                    disabled={requestPayout.isPending}
                    onRequest={() => handleCurrencyChange("USD")}
                />
                <div className="border-t border-border-light/30 pt-3">
                    <BalanceRow
                        currency="NGN"
                        balance={balanceNgn}
                        disabled={requestPayout.isPending}
                        onRequest={() => handleCurrencyChange("NGN")}
                    />
                </div>
            </div>

            {/* Request form */}
            {showForm && (
                <form
                    onSubmit={handleRequest}
                    className={cn(AFFILIATE_GLASS_SURFACE, "p-6 mb-8 space-y-5")}
                >
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-semibold text-heading">
                            Request payout — {currency}
                        </h3>
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                resetForm();
                            }}
                            className="p-1 hover:bg-button-secondary rounded-lg transition-colors"
                        >
                            <LucideX className="w-5 h-5 text-muted" />
                        </button>
                    </div>

                    {/* Balance context */}
                    <div className="bg-background-primary rounded-xl px-4 py-3 flex items-center justify-between">
                        <span className="text-xs text-muted">
                            Available balance:
                        </span>
                        <span className="text-sm font-semibold text-heading">
                            {currencySymbol}
                            {activeBalance.toFixed(2)}
                        </span>
                    </div>

                    {/* Minimum payout notice */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2">
                        <LucideAlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-800">
                            Minimum payout is <strong>{currencySymbol}{minPayout.toLocaleString()}</strong> for {currency} payouts.
                            {activeBalance < minPayout && (
                                <span className="block mt-1">
                                    You need {currencySymbol}{(minPayout - activeBalance).toLocaleString()} more to reach the minimum.
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Amount */}
                        <div>
                            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                Amount ({currencySymbol})
                            </label>
                            <input
                                type="number"
                                step={currency === "NGN" ? "1" : "0.01"}
                                min={minPayout}
                                max={activeBalance}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder={minPayout.toLocaleString()}
                                className="w-full px-4 py-2.5 rounded-xl border border-border-light/60 bg-white text-sm text-heading placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                            />
                        </div>

                        {/* Payment method */}
                        <div>
                            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                Payment method
                            </label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => {
                                    setPaymentMethod(e.target.value);
                                    setPaymentDetails("");
                                    setSelectedBank("");
                                    setAccountNumber("");
                                    setAccountName("");
                                }}
                                className="w-full px-4 py-2.5 rounded-xl border border-border-light/60 bg-white text-sm text-heading focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                            >
                                <option value="bank_transfer">
                                    Bank Transfer
                                </option>
                                <option value="paypal">PayPal</option>
                                <option value="mobile_money">Mobile Money</option>
                            </select>
                        </div>

                        {/* NGN Bank details */}
                        {currency === "NGN" && paymentMethod === "bank_transfer" && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                        Bank
                                    </label>
                                    <select
                                        value={selectedBank}
                                        onChange={(e) => {
                                            setSelectedBank(e.target.value);
                                            setAccountNumber("");
                                            setAccountName("");
                                            setPaymentDetails("");
                                        }}
                                        disabled={!banks?.length}
                                        className="w-full px-4 py-2.5 rounded-xl border border-border-light/60 bg-white text-sm text-heading focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all disabled:opacity-60"
                                    >
                                        <option value="">
                                            {banks?.length
                                                ? "Select bank"
                                                : "Loading banks..."}
                                        </option>
                                        {(banks ?? []).map((bank) => (
                                            <option
                                                key={bank.code}
                                                value={bank.code}
                                            >
                                                {bank.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                        Account number
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            value={accountNumber}
                                            onChange={(e) => {
                                                setAccountNumber(e.target.value);
                                                setAccountName("");
                                            }}
                                            placeholder="10-digit account number"
                                            maxLength={10}
                                            className="flex-1 px-4 py-2.5 rounded-xl border border-border-light/60 bg-white text-sm text-heading placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                                        />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            onClick={handleValidateAccount}
                                            disabled={!selectedBank || accountNumber.length < 10 || validateAccount.isPending}
                                        >
                                            {validateAccount.isPending ? (
                                                <LucideLoader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                "Validate"
                                            )}
                                        </Button>
                                    </div>
                                    <div className="mt-1.5 min-h-4.5">
                                        {accountName && (
                                            <p className="text-xs text-accent font-medium flex items-center gap-1">
                                                <LucideCheck className="w-3 h-3" />
                                                {accountName}
                                            </p>
                                        )}
                                        {validateAccount.isError && (
                                            <p className="text-xs text-danger flex items-center gap-1">
                                                <LucideAlertCircle className="w-3 h-3" />
                                                {(validateAccount.error as any)?.response?.data?.error || "Could not verify account."}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                        Account name
                                    </label>
                                    <input
                                        value={accountName}
                                        onChange={(e) => setAccountName(e.target.value)}
                                        placeholder="Account holder name"
                                        className="w-full px-4 py-2.5 rounded-xl border border-border-light/60 bg-white text-sm text-heading placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                                    />
                                    <p className="text-xs text-muted mt-1">
                                        {validateAccount.isSuccess
                                            ? "Auto-filled from validation. You may edit if needed."
                                            : "Enter the name on the bank account. Use Validate to auto-fill."}
                                    </p>
                                </div>
                            </>
                        )}

                        {/* PayPal / Other */}
                        {paymentMethod !== "bank_transfer" || currency !== "NGN" ? (
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                    {paymentMethod === "paypal"
                                        ? "PayPal email"
                                        : paymentMethod === "mobile_money"
                                          ? "Mobile money number"
                                          : "Account details"}
                                </label>
                                <input
                                    value={paymentDetails}
                                    onChange={(e) =>
                                        setPaymentDetails(e.target.value)
                                    }
                                    placeholder={
                                        paymentMethod === "paypal"
                                            ? "your@email.com"
                                            : "**** ***"
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl border border-border-light/60 bg-white text-sm text-heading placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                                />
                            </div>
                        ) : null}
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-border-light/30">
                        <Button
                            type="submit"
                            loading={requestPayout.isPending}
                            size="sm"
                        >
                            Submit request — {currencySymbol}
                            {amount || "0"}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setShowForm(false);
                                resetForm();
                            }}
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
                                        <th className="px-6 py-3 font-semibold">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 font-semibold hidden sm:table-cell">
                                            Method
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 font-semibold hidden md:table-cell">
                                            Requested
                                        </th>
                                        <th className="px-6 py-3 font-semibold text-right">
                                            Processed
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payouts.map((p) => (
                                        <tr
                                            key={p.id}
                                            className="border-b border-border-light/30 last:border-0 hover:bg-background-secondary/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-heading font-semibold">
                                                {p.currency === "NGN"
                                                    ? "\u20a6"
                                                    : "$"}
                                                {parseFloat(p.amount).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-muted capitalize hidden sm:table-cell">
                                                {p.payment_method.replace(/_/g, " ")}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={cn(
                                                        "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize",
                                                        payoutStatusColors[p.status] ||
                                                            "text-muted bg-button-secondary",
                                                    )}
                                                >
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-muted hidden md:table-cell">
                                                {new Date(
                                                    p.requested_at,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-muted text-right">
                                                {p.processed_at
                                                    ? new Date(
                                                          p.processed_at,
                                                      ).toLocaleDateString()
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
                            <p className="text-sm text-muted font-medium">
                                No payouts yet
                            </p>
                            <p className="text-xs text-muted/70 mt-1">
                                Request your first payout once you have earned
                                commissions
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Payouts;