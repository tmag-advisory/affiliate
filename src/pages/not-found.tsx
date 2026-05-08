import { Link } from "react-router-dom";
import { LucideArrowLeft } from "lucide-react";

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background-primary px-4">
            <div className="text-center max-w-sm">
                <h1 className="text-6xl font-serif text-heading mb-2">404</h1>
                <p className="text-muted mb-6">
                    This page doesn&apos;t exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                >
                    <LucideArrowLeft className="w-4 h-4" />
                    Back to dashboard
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
