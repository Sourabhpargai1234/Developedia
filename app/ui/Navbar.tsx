"use client"
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  HomeIcon,
  DocumentDuplicateIcon,
  PresentationChartBarIcon,
  UserIcon,
  ArrowUpTrayIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const links = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'About', href: '/dashboard/about', icon: PresentationChartBarIcon },
  { name: 'Feeds', href: '/dashboard/feeds', icon: DocumentDuplicateIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  { name: 'Upload', href: '/dashboard/fileUpload', icon: ArrowUpTrayIcon },
  { name: 'Code Editor', href: '/dashboard/codeEditor', icon: CommandLineIcon }
];

export default function NavLinks({ direction = "horizontal" }: { direction?: "horizontal" | "vertical" }) {
  const pathname = usePathname();

  return (
    <div className={clsx(
      {
      "flex space-x-2": direction === "horizontal", // Horizontal layout
      "flex flex-col space-y-2": direction === "vertical" // Vertical layout
    })}>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex items-center gap-2 no-underline rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:p-2 md:px-3',
              { 'bg-sky-100 text-blue-600': pathname === link.href }
            )}
          >
            <LinkIcon className="w-6"/>
            <p className="hidden md:block" style={{ marginBottom: "0rem" }}>{link.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
