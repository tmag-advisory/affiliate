import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import { LucideMail, LucideLock, LucideEye, LucideEyeOff } from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please enter your email and password.");
            return;
        }
        setLoading(true);
        try {
            await login({ email, password });
            toast.success("Welcome back!");
            navigate("/");
        } catch (err: unknown) {
            const msg =
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (err as any)?.response?.data?.message || "Invalid credentials. Please try again.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
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
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border-light/60 bg-white text-sm text-heading placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        autoComplete="current-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading cursor-pointer"
                    >
                        {showPassword ? <LucideEyeOff className="w-4 h-4" /> : <LucideEye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-end">
                <Link
                    to="/forgot-password"
                    className="text-sm text-accent hover:text-accent/80 transition-colors"
                >
                    Forgot password?
                </Link>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
                Sign in
            </Button>

            <p className="text-sm text-center text-muted">
                Don&apos;t have an affiliate account?{" "}
                <Link to="/register" className="text-accent hover:text-accent/80 transition-colors font-medium">
                    Register
                </Link>
            </p>
        </form>
    );
};

export default Login;
