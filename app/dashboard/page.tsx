import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import SignOutButton from "@/app/components/SignOutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <div className="border border-indigo-200 rounded-2xl shadow-sm p-8 bg-white">
        <p className="text-sm font-semibold text-indigo-700 mb-2">Your Workspace</p>
        <h1 className="text-2xl font-semibold mb-2 text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mb-6">Welcome back{session.user.name ? `, ${session.user.name}` : ""}.</p>

        <div className="border rounded-lg p-4 bg-indigo-50 border-indigo-200 mb-6">
          <p className="font-semibold mb-1 text-indigo-900">Account Benefits</p>
          <ul className="list-disc pl-5 text-sm text-indigo-900/90 space-y-1">
            <li>Track your report status</li>
            <li>Save and return to your report drafts</li>
            <li>Receive secure follow-up updates</li>
          </ul>
        </div>

        <SignOutButton />
      </div>
    </div>
  );
}
