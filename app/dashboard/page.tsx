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
    <div className="max-w-3xl mx-auto mt-10 border rounded-xl shadow-lg p-8 bg-white">
      <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
      <p className="text-gray-700 mb-6">Welcome back{session.user.name ? `, ${session.user.name}` : ""}.</p>

      <div className="border rounded-lg p-4 bg-purple-50 border-purple-200 mb-6">
        <p className="font-semibold mb-1">Account Benefits</p>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Track your report status</li>
          <li>Save and return to report drafts</li>
          <li>Receive secure follow-up updates</li>
        </ul>
      </div>

      <SignOutButton />
    </div>
  );
}
