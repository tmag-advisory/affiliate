import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background-primary px-4 py-12">
            <div className="w-full max-w-md">
                <div className="rounded-3xl border border-border-light/60 bg-white backdrop-blur-md shadow-[0_2px_8px_-2px_rgba(10,20,18,0.04),0_8px_28px_-18px_rgba(10,20,18,0.07)] p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-serif text-heading tracking-tight">
                            Affiliate Dashboard
                        </h1>
                        <p className="text-sm text-muted mt-1">
                            Travel Medicine Advisory Global
                        </p>
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
