import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import HeaderNav from "@/app/components/HeaderNav";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-40 border-b border-indigo-900/50 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-col gap-4 px-4 sm:px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xl font-semibold tracking-tight text-white">SpeakEqual</p>
          <p className="text-xs text-indigo-200">Fair Reporting and Community Support</p>
        </div>

        <div className="flex flex-col gap-2 lg:items-end">
          <HeaderNav isAuthenticated={Boolean(session?.user)} />
        </div>
      </div>
    </header>
  );
}