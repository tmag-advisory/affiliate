import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AffiliateHeader from "../../components/affiliate/AffiliateHeader";
import Button from "../../components/ui/Button";
import { cn } from "../../lib/utils";
import { AFFILIATE_GLASS_SURFACE } from "../../lib/chrome";
import { LucideUser, LucideMail, LucidePhone, LucideSave } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";

type SettingsTab = "profile" | "account";

const Settings = () => {
    const { user, refreshProfile } = useAuth();
    const [tab, setTab] = useState<SettingsTab>("profile");

    const [firstName, setFirstName] = useState(user?.first_name ?? "");
    const [lastName, setLastName] = useState(user?.last_name ?? "");
    const [phone, setPhone] = useState(user?.phone ?? "");
    const [saving, setSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put("/profile", {
                first_name: firstName,
                last_name: lastName,
                phone,
            });
            await refreshProfile();
            toast.success("Profile updated!");
        } catch {
            toast.error("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const tabs: { id: SettingsTab; label: string }[] = [
        { id: "profile", label: "Profile" },
        { id: "account", label: "Account" },
    ];

    return (
        <div>
            <AffiliateHeader title="Settings" />

            {/* Tabs */}
            <div className={cn(AFFILIATE_GLASS_SURFACE, "flex gap-1 mb-8 p-1 w-fit")}>
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all duration-300 ease-out cursor-pointer ${
                            tab === t.id
                                ? "bg-dark text-white shadow-sm"
                                : "text-muted hover:text-heading hover:bg-background-secondary"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Profile tab */}
            {tab === "profile" && (
                <form onSubmit={handleSave} className="max-w-2xl">
                    <div className={cn(AFFILIATE_GLASS_SURFACE, "p-6 md:p-8 space-y-5")}>
                        <h2 className="text-base font-semibold text-heading mb-6">Personal information</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                    First name
                                </label>
                                <div className="relative">
                                    <LucideUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                    <input
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-light bg-white text-sm text-heading outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                    Last name
                                </label>
                                <input
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-border-light bg-white text-sm text-heading outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <LucideMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    value={user?.email ?? ""}
                                    disabled
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-light bg-button-secondary/50 text-muted text-sm cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-muted mt-1">Email cannot be changed. Contact support if needed.</p>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                Phone
                            </label>
                            <div className="relative">
                                <LucidePhone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+1 (555) 123-4567"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-light bg-white text-sm text-heading placeholder:text-muted/50 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-border-light/50">
                            <Button type="submit" loading={saving}>
                                <LucideSave className="w-4 h-4" />
                                Save changes
                            </Button>
                        </div>
                    </div>
                </form>
            )}

            {/* Account tab */}
            {tab === "account" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className={cn(AFFILIATE_GLASS_SURFACE, "p-6 md:p-8")}>
                            <h2 className="text-base font-semibold text-heading mb-6">Account information</h2>
                            <div className="space-y-5">
                                <div className="pb-4 border-b border-border-light/30">
                                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Member ID</p>
                                    <p className="text-sm text-heading font-mono">#{user?.id}</p>
                                </div>
                                <div className="pb-4 border-b border-border-light/30">
                                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Account status</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-success"></div>
                                        <p className="text-sm text-heading font-medium">Active</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Last login</p>
                                    <p className="text-sm text-heading">
                                        {user?.last_login
                                            ? new Date(user.last_login).toLocaleString()
                                            : "Never"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={cn(AFFILIATE_GLASS_SURFACE, "p-6 h-fit")}>
                        <h3 className="text-base font-semibold text-heading mb-4">Support</h3>
                        <p className="text-xs text-muted mb-4">
                            Need help? Contact our support team for assistance with your affiliate account.
                        </p>
                        <a
                            href="mailto:support@tmag.com"
                            className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-dark text-white font-semibold text-sm hover:bg-darkest transition-colors duration-200"
                        >
                            Contact support
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
