"use client"
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

import {
  HomeIcon,
  DocumentDuplicateIcon,
  PresentationChartBarIcon,
  UserIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
const links = [
  { name: 'Home', href: '/', icon: HomeIcon },
  {
    name: 'About', href: '/dashboard/about', icon: PresentationChartBarIcon
  },
  {
    name: 'Feeds',
    href: '/dashboard/feeds',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  { name: 'Upload', href: '/dashboard/fileUpload', icon: ArrowUpTrayIcon}
];

export default function NavLinks() {
  const pathname=usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}