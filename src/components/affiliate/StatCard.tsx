import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { AFFILIATE_GLASS_SURFACE } from "../../lib/chrome";


interface StatCardProps {
    label: string;
    value: string | number;
    icon?: ReactNode;
    detail?: string;
    accent?: boolean;
    trend?: { value: string; positive: boolean };
}

const StatCard = ({ label, value, icon, detail, accent, trend }: StatCardProps) => {
    return (
        <div className={cn(AFFILIATE_GLASS_SURFACE, "p-4 sm:p-6 flex flex-col gap-3")}>
            <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted font-semibold">
                    {label}
                </span>
                {icon && (
                    <div
                        className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            accent
                                ? "bg-affiliate/10 text-affiliate"
                                : "bg-button-secondary text-heading",
                        )}
                    >
                        {icon}
                    </div>
                )}
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-serif text-heading">{value}</span>
                {trend && (
                    <span
                        className={cn(
                            "text-xs font-medium",
                            trend.positive ? "text-success" : "text-danger",
                        )}
                    >
                        {trend.positive ? "↑" : "↓"} {trend.value}
                    </span>
                )}
            </div>
            {detail && <span className="text-xs text-muted">{detail}</span>}
        </div>
    );
};

export default StatCard;
