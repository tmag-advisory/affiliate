import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-background-primary flex flex-col w-full">
            <div className="flex-1 flex items-center justify-center px-6 pb-16 pt-10">
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
