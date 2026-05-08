import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import { LucideUser, LucideMail, LucideLock } from "lucide-react";
import toast from "react-hot-toast";

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== passwordConfirmation) {
            toast.error("Passwords do not match.");
            return;
        }
        setLoading(true);
        try {
            await register({
                first_name: firstName,
                last_name: lastName,
                username: `${email.split("@")[0]}${firstName}`.toLowerCase(),
                email,
                password,
                password_confirmation: passwordConfirmation,
                account_type: "AFFILIATE",
            });
            toast.success("Account created successfully!");
            navigate("/");
        } catch (err: unknown) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const msg = (err as any)?.response?.data?.message || "Registration failed. Please try again.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-heading mb-1.5">
                        First name
                    </label>
                    <div className="relative">
                        <LucideUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="John"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-light/60 bg-white text-sm text-heading placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-heading mb-1.5">
                        Last name
                    </label>
                    <input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full px-4 py-2.5 rounded-xl border border-border-light/60 bg-white text-sm text-heading placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                    />
                </div>
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

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-heading mb-1.5">
                    Password
                </label>
                <div className="relative">
                    <LucideLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-light/60 bg-white text-sm text-heading placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        autoComplete="new-password"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-heading mb-1.5">
                    Confirm password
                </label>
                <div className="relative">
                    <LucideLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                        id="passwordConfirmation"
                        type="password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        placeholder="Repeat your password"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-light/60 bg-white text-sm text-heading placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        autoComplete="new-password"
                    />
                </div>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
                Create account
            </Button>

            <p className="text-sm text-center text-muted">
                Already have an account?{" "}
                <Link to="/login" className="text-accent hover:text-accent/80 transition-colors font-medium">
                    Sign in
                </Link>
            </p>
        </form>
    );
};

export default Register;
