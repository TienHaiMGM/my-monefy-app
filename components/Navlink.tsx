// components/NavLink.tsx
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`hover:text-indigo-600 ${active ? 'font-semibold text-indigo-600' : ''}`}
    >
      {children}
    </Link>
  );
}
