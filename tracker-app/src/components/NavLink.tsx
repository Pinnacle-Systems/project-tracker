'use client';
import { usePathname } from 'next/navigation';
import Link from "next/link";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`text-sm  transition-colors ${
        isActive ? 'text-blue-600 font-[500]' : 'text-gray-700 font-medium hover:text-blue-600 '
      }`}>
      {children}
    </Link>
  )
}