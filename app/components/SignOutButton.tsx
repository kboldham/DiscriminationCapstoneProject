"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      className="bg-slate-800 text-white rounded-md px-4 py-2 hover:bg-slate-900 transition font-medium"
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Sign Out
    </button>
  );
}
