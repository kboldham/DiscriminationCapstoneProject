import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <section className="rounded-2xl border border-indigo-300 bg-gradient-to-r from-indigo-600 to-teal-500 shadow-sm p-8 md:p-10 text-white">
        <p className="text-xs font-semibold tracking-wide uppercase text-indigo-100 mb-3">Community-first reporting in Durham, NC</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Welcome to SpeakEqual</h1>
        <p className="text-indigo-50 text-lg max-w-3xl leading-relaxed">
          A trusted space to report discrimination, understand your options, and take clear next steps.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/report" className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors">
            File a Report
          </Link>
          <Link href="/about" className="rounded-md border border-white/80 bg-transparent px-5 py-2.5 text-sm font-medium text-white hover:bg-white/15 transition-colors">
            Project Overview
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="border border-indigo-200 rounded-xl shadow-sm p-6 bg-indigo-50">
          <h2 className="text-lg font-semibold mb-2 text-indigo-700">Start a Report</h2>
          <p className="text-slate-600 leading-relaxed">
            Report incidents in housing, employment, and public accommodations through a guided process.
          </p>
        </div>

        <div className="border border-teal-200 rounded-xl shadow-sm p-6 bg-teal-50">
          <h2 className="text-lg font-semibold mb-2 text-teal-700">Explore Your Next Steps</h2>
          <p className="text-slate-600 leading-relaxed">
            Learn your rights, reporting options, and practical actions you can take.
          </p>
        </div>

        <div className="border border-amber-200 rounded-xl shadow-sm p-6 bg-amber-50">
          <h2 className="text-lg font-semibold mb-2 text-amber-700">Track with an Account</h2>
          <p className="text-slate-600 leading-relaxed">
            Creating an account is optional. You can always report anonymously.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-indigo-200 bg-indigo-50 px-6 py-4 shadow-sm">
        <p className="text-indigo-700 font-semibold">Community Commitment</p>
        <p className="text-slate-600 text-sm mt-1">SpeakEqual centers dignity, safety, and accountability in every step of the reporting process.</p>
      </section>
    </div>
  );
}
