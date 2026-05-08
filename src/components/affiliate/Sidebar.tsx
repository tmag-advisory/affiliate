import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";
import { useSidebarStore } from "../../stores/sidebarStore";
import type { ReactNode } from "react";
import {
    LucideLayoutDashboard,
    LucideLink2,
    LucideCoins,
    LucideWallet,
    LucideBookOpen,
    LucideSettings,
    LucideLogOut,
    LucideX,
    LucidePercent,
} from "lucide-react";

interface NavItem {
    label: string;
    href: string;
    icon: ReactNode;
}

const navItems: NavItem[] = [
    {
        label: "Overview",
        href: "/",
        icon: <LucideLayoutDashboard className="w-4 h-4" />,
    },
    {
        label: "Referral Links",
        href: "/links",
        icon: <LucideLink2 className="w-4 h-4" />,
    },
    {
        label: "Commissions",
        href: "/commissions",
        icon: <LucideCoins className="w-4 h-4" />,
    },
    {
        label: "Payouts",
        href: "/payouts",
        icon: <LucideWallet className="w-4 h-4" />,
    },
    {
        label: "Resources",
        href: "/resources",
        icon: <LucideBookOpen className="w-4 h-4" />,
    },
    {
        label: "Settings",
        href: "/settings",
        icon: <LucideSettings className="w-4 h-4" />,
    },
];

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { open, close } = useSidebarStore();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    // Close sidebar on route change (mobile)
    useEffect(() => {
        close();
    }, [location.pathname, close]);

    const isActive = (href: string) => {
        if (href === "/") return location.pathname === "/";
        return location.pathname.startsWith(href);
    };

    return (
        <>
            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={close}
                />
            )}

            <aside
                className={cn(
                    "fixed top-0 left-0 h-screen w-64 bg-darkest text-white flex flex-col z-50 transition-transform duration-300",
                    open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                )}
            >
                {/* Logo + close button */}
                <div className="flex items-center justify-between px-6 py-6 border-b border-white/6">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-affiliate/20 flex items-center justify-center">
                            <LucidePercent className="w-4 h-4 text-affiliate" />
                        </div>
                        <span className="text-lg font-serif font-medium tracking-tight">
                            Affiliate
                        </span>
                    </Link>
                    <button
                        onClick={close}
                        className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors duration-150 cursor-pointer"
                    >
                        <LucideX className="w-4 h-4 text-white/50" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150",
                                isActive(item.href)
                                    ? "bg-white/10 text-white"
                                    : "text-white/45 hover:text-white hover:bg-white/4",
                            )}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* User info + logout */}
                <div className="px-4 py-4 border-t border-white/6">
                    <div className="flex items-center gap-3 mb-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold text-white/70">
                            {user?.first_name?.charAt(0) ?? "?"}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {user ? `${user.first_name} ${user.last_name}` : ""}
                            </p>
                            <p className="text-xs text-white/30 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/4 transition-colors duration-150 cursor-pointer"
                    >
                        <LucideLogOut className="w-4 h-4" />
                        Sign out
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
