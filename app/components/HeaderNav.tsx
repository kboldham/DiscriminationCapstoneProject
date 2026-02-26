"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type HeaderNavProps = {
  isAuthenticated: boolean;
};

function navClass(isActive: boolean) {
  return `px-3 py-2 rounded-md text-sm font-medium border transition-colors ${
    isActive
      ? "border-indigo-400 bg-indigo-500 text-white shadow-sm"
      : "border-indigo-200 bg-indigo-50/90 text-indigo-900 hover:bg-indigo-100"
  }`;
}

export default function HeaderNav({ isAuthenticated }: HeaderNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-3 p-1">
      <Link href="/" className={navClass(pathname === "/")}>
        Home
      </Link>
      <Link href="/report" className={navClass(pathname === "/report")}>
        Report
      </Link>
      <Link href="/educate" className={navClass(pathname === "/educate")}>
        Resources
      </Link>
      <Link href="/about" className={navClass(pathname === "/about")}>
        About
      </Link>

      <span className="mx-1 h-6 w-px bg-indigo-300/70" aria-hidden="true" />

      {isAuthenticated ? (
        <Link href="/dashboard" className={navClass(pathname === "/dashboard")}>
          Dashboard
        </Link>
      ) : null}

      <Link
        href="/auth/signin?callbackUrl=/report"
        className={navClass(pathname.startsWith("/auth"))}
      >
        Sign In / Sign Up
      </Link>
    </nav>
  );
}
