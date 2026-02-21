"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      className="bg-gray-900 text-white rounded-md px-4 py-2 hover:opacity-90 transition"
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Sign Out
    </button>
  );
}
