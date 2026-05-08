import { LucideDownload, LucideImage, LucideFileText, LucideMail, LucideCopy, LucideCheck } from "lucide-react";
import AffiliateHeader from "../../components/affiliate/AffiliateHeader";
import Button from "../../components/ui/Button";
import { cn } from "../../lib/utils";
import { AFFILIATE_GLASS_SURFACE } from "../../lib/chrome";
import { useState } from "react";
import toast from "react-hot-toast";

const resources = [
    {
        title: "Banner ads",
        description: "Ready-to-use promotional banners for your website.",
        icon: <LucideImage className="w-5 h-5" />,
        items: [
            { name: "Leaderboard Banner (728×90)", format: "PNG" },
            { name: "Square Banner (300×250)", format: "PNG" },
            { name: "Skyscraper (160×600)", format: "PNG" },
        ],
    },
    {
        title: "Email templates",
        description: "Pre-written email templates for promoting TMAG.",
        icon: <LucideMail className="w-5 h-5" />,
        items: [
            { name: "Welcome Email", format: "HTML" },
            { name: "Promotional Email", format: "HTML" },
            { name: "Seasonal Campaign", format: "HTML" },
        ],
    },
    {
        title: "Content guides",
        description: "Talking points and guides for promoting travel health.",
        icon: <LucideFileText className="w-5 h-5" />,
        items: [
            { name: "Affiliate Guide", format: "PDF" },
            { name: "Product FAQ", format: "PDF" },
            { name: "Health Statistics", format: "PDF" },
        ],
    },
];

const Resources = () => {
    const [copiedCode, setCopiedCode] = useState(false);

    const referralCode = "YOUR_CODE";
    const baseUrl = import.meta.env.VITE_API_BASE_URL
        ? `${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}/ref`
        : "https://tmag.com/ref";

    const fullUrl = `${baseUrl}/${referralCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(fullUrl).then(() => {
            setCopiedCode(true);
            toast.success("Link copied!");
            setTimeout(() => setCopiedCode(false), 2000);
        });
    };

    return (
        <div>
            <AffiliateHeader title="Marketing Resources" />

            <p className="text-sm text-muted mb-8 max-w-xl">
                Download marketing materials and content to help you promote TMAG effectively.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {resources.map((section) => (
                    <div key={section.title} className={cn(AFFILIATE_GLASS_SURFACE, "p-6")}>
                        <div className="w-10 h-10 rounded-xl bg-affiliate/10 flex items-center justify-center mb-4">
                            <div className="text-affiliate">{section.icon}</div>
                        </div>
                        <h3 className="text-base font-semibold text-heading mb-1">{section.title}</h3>
                        <p className="text-xs text-muted mb-4">{section.description}</p>
                        <ul className="space-y-2">
                            {section.items.map((item) => (
                                <li
                                    key={item.name}
                                    className="flex items-center justify-between py-2.5 border-b border-border-light/30 last:border-0"
                                >
                                    <div>
                                        <p className="text-sm text-heading font-medium">{item.name}</p>
                                        <span className="text-[11px] text-muted">{item.format}</span>
                                    </div>
                                    <button
                                        className="p-1.5 rounded-lg hover:bg-button-secondary transition-colors cursor-pointer flex-shrink-0"
                                        title="Download"
                                    >
                                        <LucideDownload className="w-4 h-4 text-muted hover:text-affiliate transition-colors" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Referral link section */}
            <div className={cn(AFFILIATE_GLASS_SURFACE, "p-6")}>
                <h3 className="text-base font-semibold text-heading mb-1">Your referral link</h3>
                <p className="text-xs text-muted mb-4">
                    Share this link anywhere to start earning commissions immediately.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <code className="flex-1 px-4 py-3 rounded-xl bg-button-secondary text-sm text-heading font-mono break-all">
                        {fullUrl}
                    </code>
                    <Button
                        size="sm"
                        onClick={handleCopy}
                        className="flex-shrink-0 w-full sm:w-auto"
                    >
                        {copiedCode ? (
                            <>
                                <LucideCheck className="w-4 h-4" />
                                Copied
                            </>
                        ) : (
                            <>
                                <LucideCopy className="w-4 h-4" />
                                Copy
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Resources;
