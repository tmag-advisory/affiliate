import { LucideMenu, LucidePercent } from "lucide-react";
import { useSidebarStore } from "../../stores/sidebarStore";
import { cn } from "../../lib/utils";

const AffiliateHeader = ({ title }: { title: string }) => {
    const toggle = useSidebarStore((s) => s.toggle);

    const chipCls =
        "rounded-xl border border-border-light/55 bg-white/75 px-3 py-2 backdrop-blur-md shadow-[0_1px_3px_rgba(10,20,18,0.04),0_6px_20px_-14px_rgba(10,20,18,0.06)]";

    return (
        <header className="flex items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3 min-w-0">
                <button
                    onClick={toggle}
                    className={cn(
                        chipCls,
                        "lg:hidden p-2 text-heading transition-colors duration-150 cursor-pointer shrink-0 hover:border-accent/25",
                    )}
                >
                    <LucideMenu className="w-5 h-5" />
                </button>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-serif text-heading tracking-tight truncate">
                    {title}
                </h1>
            </div>
            <div className={cn(chipCls, "flex items-center gap-2 sm:px-4")}>
                <LucidePercent className="w-4 h-4 text-affiliate" />
                <span className="text-sm font-semibold text-heading">Affiliate</span>
            </div>
        </header>
    );
};

export default AffiliateHeader;
