import { Inter } from "next/font/google";
import "../globals.css";
import SideNav from "../ui/Sidenav";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      {/* Sidebar */}
      <div className="w-full flex-none md:w-64 md:fixed md:left-0 md:top-0 md:h-screen md:overflow-hidden bg-gray-200 shadow-lg">
        <SideNav />
      </div>
      {/* Main content */}
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12 md:ml-64">
        {children}
      </div>
    </div>
  );
}



