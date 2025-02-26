"use client";

import Link from 'next/link';
import Navbar from './Navbar';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { signOut } from 'next-auth/react';

export default function SideNav() {
  return (
    <div className="flex flex-col px-3 py-4 md:px-2" style={{ height: "100vh" }}>
      <Link
        className="mb-4 flex items-center justify-center no-underline rounded-md bg-blue-600 p-4 text-2xl font-bold text-white md:h-20"
        href="/"
      >
        Dashboard
      </Link>

      {/* Navigation and Content Wrapper */}
      <div className="flex flex-col no-underline flex-1 space-y-4 overflow-y-auto">
        {/* Navbar */}
        <Navbar direction="vertical" />
      </div>

      {/* Sign Out Button - Always at the Bottom */}
      <button 
        className="mt-auto flex items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:justify-start md:p-2 md:px-3"
        onClick={() => signOut()}  
      >
        <UserCircleIcon className="w-6"/>
        <span className="hidden md:inline">Sign Out</span>
      </button>
    </div>
  );
}
