import { Inter } from "next/font/google";
import "../globals.css";
import SideNav from "../ui/Sidenav";
import AdSense from "../ui/ads/AdSense";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex h-full sm:h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        <head>
          <AdSense pId="ca-pub-2736406526636598"/>
        </head>
      </div>
    );
  }


