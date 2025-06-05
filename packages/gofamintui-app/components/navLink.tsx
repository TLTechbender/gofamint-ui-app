"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function NavLink({
  href,
  children,
  exact = false,
  ...props
}: {
  href: string;
  children: (props: { isActive: boolean }) => ReactNode;
  exact?: boolean;
  [key: string]: any;
}) {
  const pathname = usePathname();

  const isActive = exact ? pathname === href : pathname.includes(href);

  return (
    <Link href={href} {...props}>
      {children({ isActive })}
    </Link>
  );
}
