import { Outlet } from "react-router-dom";
import Sidebar from "../components/affiliate/Sidebar";
import AffiliateFooter from "../components/affiliate/AffiliateFooter";
import { AffiliateAmbientBackground } from "../lib/chrome";


const AffiliateLayout = () => {
    return (
        <div className="relative min-h-screen overflow-x-hidden bg-background-primary">
            <AffiliateAmbientBackground />
            <Sidebar />
            <main className="relative z-10 lg:ml-64 px-4 sm:px-6 lg:px-12 py-6 sm:py-8 max-w-6xl">
                <Outlet />
            </main>
            <AffiliateFooter />
        </div>
    );
};

export default AffiliateLayout;
