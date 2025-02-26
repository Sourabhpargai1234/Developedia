"use client";

import Link from 'next/link';
import Navbar from './Navbar';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function SideNav() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="flex flex-col px-3 py-4 md:px-2 h-21">
      <Link
        className="mb-4 flex items-center justify-center no-underline rounded-md bg-blue-600 p-4 text-2xl font-bold text-white md:h-20"
        href="/"
      >
        Dashboard
      </Link>

      <div className={`flex ${isMobile ? "flex-row space-x-4" : "flex-col space-y-4"} no-underline flex-1 overflow-y-auto`}>
        <Navbar direction={isMobile ? "horizontal" : "vertical"} />
        <button
          className={`flex gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:justify-start md:p-2 md:px-3 
          ${isMobile ? "self-center" : "mt-3"}`}
          onClick={() => signOut()}
        >
          <UserCircleIcon className="w-6" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>

    </div>
  );
}
