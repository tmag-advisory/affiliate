import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Button from "../../components/ui/Button";
import { LucideMail, LucideArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email address.");
            return;
        }
        setLoading(true);
        try {
            await api.post("/auth/forgot-password", { email });
            setSent(true);
            toast.success("Reset link sent! Check your email.");
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-success-light flex items-center justify-center mx-auto">
                    <LucideMail className="w-6 h-6 text-success" />
                </div>
                <h2 className="text-lg font-serif text-heading">Check your email</h2>
                <p className="text-sm text-muted">
                    We&apos;ve sent a password reset link to <strong className="text-heading">{email}</strong>.
                </p>
                <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 transition-colors font-medium"
                >
                    <LucideArrowLeft className="w-4 h-4" />
                    Back to login
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center">
                <h2 className="text-lg font-serif text-heading">Reset password</h2>
                <p className="text-sm text-muted mt-1">
                    Enter your email and we&apos;ll send you a reset link.
                </p>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-heading mb-1.5">
                    Email address
                </label>
                <div className="relative">
                    <LucideMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-light/60 bg-white text-sm text-heading placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        autoComplete="email"
                    />
                </div>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
                Send reset link
            </Button>

            <p className="text-sm text-center">
                <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-accent hover:text-accent/80 transition-colors font-medium"
                >
                    <LucideArrowLeft className="w-4 h-4" />
                    Back to login
                </Link>
            </p>
        </form>
    );
};

export default ForgotPassword;
