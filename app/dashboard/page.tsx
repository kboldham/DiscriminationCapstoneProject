import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SignOutButton from "@/app/components/SignOutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  const reports = await prisma.report.findMany({
    where: {
      OR: [
        { userId: session.user.id },
        ...(session.user.email ? [{ reporterEmail: session.user.email.toLowerCase() }] : []),
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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

        <div className="border border-slate-200 rounded-xl p-5 mb-6 bg-slate-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Your Reports</h2>
            <span className="text-xs font-medium text-slate-600">{reports.length} total</span>
          </div>

          {reports.length === 0 ? (
            <p className="text-sm text-slate-600">
              No reports yet. Submit your first report to track its status here.
            </p>
          ) : (
            <ul className="space-y-3">
              {reports.map((report) => (
                <li key={report.id} className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {report.discriminationType === "other" && report.customType
                        ? report.customType
                        : report.discriminationType}
                    </p>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                      Submitted
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">Location: {report.location}</p>
                  <p className="text-sm text-slate-600">Incident Date: {report.incidentDate}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Submitted on {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <SignOutButton />
      </div>
    </div>
  );
}
