'use client';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

export default function NavLink({ children, href }: { children?: React.ReactNode; href: string }) {
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const isActive =
    `/${selectedLayoutSegment}` === href || (href === '/' && selectedLayoutSegment === null);

  return (
    <Link
      href={href}
      className={`block rounded-lg py-2 pl-3 pr-4 hover:bg-gray-50 ${
        isActive ? 'bg-gray-100' : ''
      }`}
    >
      {children}
    </Link>
  );
}
